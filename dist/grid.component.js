"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const moment = require("moment");
const tubular_http_service_1 = require("./tubular-http.service");
const tubular_settings_service_1 = require("./tubular-settings.service");
const column_model_1 = require("./column.model");
require("rxjs/add/operator/debounceTime");
class GridPageInfo {
    constructor() {
        this.currentInitial = 0;
        this.currentTop = 0;
        this.currentPage = 0;
        this.totalPages = 0;
        this.totalRecordCount = 0;
        this.filteredRecordCount = 0;
    }
}
exports.GridPageInfo = GridPageInfo;
let GridComponent = class GridComponent {
    constructor(settingsProvider, httpService) {
        this.settingsProvider = settingsProvider;
        this.httpService = httpService;
        // data is just observable and children can't push
        this.data = new BehaviorSubject_1.BehaviorSubject([]);
        this.dataStream = this.data.asObservable();
        this._pageInfo = new BehaviorSubject_1.BehaviorSubject(new GridPageInfo());
        this.pageInfo = this._pageInfo.asObservable();
        this._pageSize = new BehaviorSubject_1.BehaviorSubject(this.getPageSizeSettingValue());
        this.pageSize = this._pageSize.asObservable();
        // values that to observe and allow to push from children
        this.page = new BehaviorSubject_1.BehaviorSubject(this.getPageSettingValue());
        this.columns = new BehaviorSubject_1.BehaviorSubject([]);
        this.freeTextSearch = new BehaviorSubject_1.BehaviorSubject('');
        this.pageSet = false;
        this.showLoading = false;
        this.search = {
            text: '',
            operator: 'None'
        };
        this.requestCount = 0;
        this.onDataError = new core_1.EventEmitter();
        this.onDataSaved = new core_1.EventEmitter();
    }
    ngOnInit() {
        // just a logging
        this.dataStream.subscribe((p) => console.log('New data', p));
        // subscriptions to events
        this.pageSize.subscribe(c => {
            this.refresh();
            this.changePageSizeData();
        });
        this.columns.subscribe((c) => this.refresh());
        this.page.subscribe((c) => {
            this.refresh();
            this.changePagesData();
        });
        this.freeTextSearch
            .debounceTime(500)
            .subscribe((c) => {
            if (c === this.search.text) {
                return;
            }
            this.search.text = c;
            this.search.operator = !c ? 'None' : 'Auto';
            this.refresh();
        });
    }
    goToPage(page) {
        this.pageSet = true;
        this.page.next(page);
    }
    refresh() {
        if (this.pageSet && this.columns.getValue().length > 0 && this._pageSize.getValue() > 0) {
            this.getCurrentPage((data, req) => this.transformDataset(data, req));
        }
    }
    getCurrentPage(callback) {
        let req = {
            count: this.requestCount++,
            columns: this.columns.getValue(),
            skip: this.page.getValue() * this._pageSize.getValue(),
            take: this._pageSize.getValue(),
            search: this.search,
            timezoneOffset: new Date().getTimezoneOffset()
        };
        // transform direction values to strings
        req.columns.forEach(this.transformSortDirection);
        this.httpService.post(this.dataUrl, req).subscribe(data => callback(data, req), error => this.onDataError.emit(error));
    }
    getFullDataSource(callback) {
        let req = {
            count: this.requestCount++,
            columns: this.columns.getValue(),
            skip: 0,
            take: -1,
            search: {
                text: '',
                operator: 'None'
            }
        };
        this.httpService.post(this.dataUrl, req).subscribe((data) => callback(data.Payload || {}), (error) => this.onDataError.emit(error));
    }
    onUpdate(row) {
        this.httpService
            .save(this.saveUrl, row.values, row.$isNew ? http_1.RequestMethod.Post : http_1.RequestMethod.Put)
            .subscribe(data => this.onDataSaved.emit(data), error => this.onDataError.emit(error), () => this.refresh());
    }
    changePagesData() {
        if (this.settingsProvider != null) {
            this.settingsProvider.put("gridPage", this.page.getValue());
        }
    }
    changePageSizeData() {
        if (this.settingsProvider != null) {
            this.settingsProvider.put("gridPageSize", this._pageSize.getValue());
        }
    }
    getPageSettingValue() {
        if (this.settingsProvider != null) {
            return this.settingsProvider.get("gridPage") || 0;
        }
        return 0;
    }
    getPageSizeSettingValue() {
        if (this.settingsProvider != null) {
            return this.settingsProvider.get("gridPageSize") || 10;
        }
        return 10;
    }
    transformSortDirection(column) {
        switch (column.direction) {
            case column_model_1.ColumnSortDirection.Asc:
                column.sortDirection = 'Ascending';
                break;
            case column_model_1.ColumnSortDirection.Desc:
                column.sortDirection = 'Descending';
                break;
            default:
                column.sortDirection = 'None';
        }
    }
    transformToObj(columns, data) {
        let obj = {};
        columns.forEach((column, key) => {
            obj[column.name] = data[key] || data[column.name];
            if (column.dataType === column_model_1.DataType.DateTimeUtc) {
                obj[column.name] = moment.utc(obj[column.name]);
            }
            if (column.dataType === column_model_1.DataType.Date || column.dataType === column_model_1.DataType.DateTime) {
                obj[column.name] = moment(obj[column.name]);
            }
        });
        return obj;
    }
    transformDataset(data, req) {
        let transform = d => this.transformToObj(req.columns, d);
        let payload = (data.Payload || {}).map(transform);
        // push data
        this.data.next(payload);
        let pageInfo = new GridPageInfo();
        pageInfo.currentPage = data.CurrentPage;
        pageInfo.totalPages = data.TotalPages;
        pageInfo.filteredRecordCount = data.FilteredRecordCount;
        pageInfo.totalRecordCount = data.TotalRecordCount;
        pageInfo.currentInitial = ((pageInfo.currentPage - 1) * this._pageSize.getValue()) + 1;
        if (pageInfo.currentInitial <= 0) {
            pageInfo.currentInitial = data.TotalRecordCount > 0 ? 1 : 0;
        }
        pageInfo.currentTop = this._pageSize.getValue() * pageInfo.currentPage;
        if (pageInfo.currentTop <= 0 || pageInfo.currentTop > data.filteredRecordCount) {
            pageInfo.currentTop = data.filteredRecordCount;
        }
        // push page Info
        this._pageInfo.next(pageInfo);
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], GridComponent.prototype, "dataUrl", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], GridComponent.prototype, "requireAuthentication", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], GridComponent.prototype, "requestTimeout", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], GridComponent.prototype, "saveUrl", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridComponent.prototype, "onDataError", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GridComponent.prototype, "onDataSaved", void 0);
GridComponent = __decorate([
    core_1.Component({
        selector: 'tb-grid',
        template: `
    <div>
        <div class="tubular-overlay" [hidden]="!showLoading">
            <div><div class="fa fa-refresh fa-2x fa-spin"></div>
        </div></div>
        <ng-content></ng-content>
    </div>`,
        styles: [
            ':host /deep/ div.row { margin-top: 4px; margin-bottom: 4px; }',
            ':host /deep/ div.row:first { margin-top: 0; }',
            ':host /deep/ .sortable { text-decoration: underline; cursor: pointer; }',
            ':host /deep/ .sortable:hover { text-decoration: none; color: yellow; }',
            ':host /deep/ .sortAsc::after { font-family: FontAwesome; content: "\\f176"; }',
            ':host /deep/ .sortDesc::after { font-family: FontAwesome; content: "\\f175"; }'
        ]
    }),
    __param(0, core_1.Optional()), __param(0, core_1.Inject(tubular_settings_service_1.SETTINGS_PROVIDER)),
    __metadata("design:paramtypes", [Object, tubular_http_service_1.TubularHttpService])
], GridComponent);
exports.GridComponent = GridComponent;

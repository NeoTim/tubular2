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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const tb_form_1 = require("./tb-form");
class FormPopup extends tb_form_1.TbForm {
    constructor(tbGrid, // TODO: Refactor, why we need the GridComponent?
        formBuilder, httpService) {
        super(formBuilder, httpService); //, toastr);
        this.tbGrid = tbGrid;
        this.formBuilder = formBuilder;
        this.httpService = httpService;
    }
    ngOnInit() {
        this.detailsForm = this.tbFormInit({
            saveUrl: this.tbGrid.saveUrl
        });
    }
    close() {
        this.modalRef.close();
    }
    save() {
        this.onSave({
            values: this.detailsForm.value,
            $isNew: this.$isNew
        }, (data) => console.log('Saved'), (error) => {
            console.log('Save error');
            this.close();
        }, () => console.log('Completed'));
    }
    getRow() {
        return this.row;
    }
    ;
}
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FormPopup.prototype, "modalRef", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FormPopup.prototype, "row", void 0);
exports.FormPopup = FormPopup;

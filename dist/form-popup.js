"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var tb_form_1 = require('./tb-form');
var FormPopup = (function (_super) {
    __extends(FormPopup, _super);
    function FormPopup(tbGrid, formBuilder) {
        _super.call(this, formBuilder);
        this.tbGrid = tbGrid;
        this.formBuilder = formBuilder;
    }
    FormPopup.prototype.ngOnInit = function () {
        this.detailsForm = this.tbFormInit();
    };
    FormPopup.prototype.close = function () {
        this.modalRef.close();
    };
    FormPopup.prototype.save = function () {
        this.tbGrid.onUpdate({
            values: this.detailsForm.value,
            $isNew: this.$isNew
        });
        this.modalRef.close();
    };
    FormPopup.prototype.getRow = function () {
        return this.row;
    };
    ;
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], FormPopup.prototype, "modalRef", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], FormPopup.prototype, "row", void 0);
    return FormPopup;
}(tb_form_1.TbForm));
exports.FormPopup = FormPopup;

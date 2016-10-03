﻿import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'popup-details',
    templateUrl: '/app/popup.component.html'
})

export class Popup {
    _row: any;
    detailsForm: FormGroup;

    constructor(private modalService: NgbModal, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.detailsForm = this.formBuilder.group(this._row);
    }

    @Input('row')
    set in(row: any) {
        this._row = row;
    }

    open(popup) {
        this.modalService.open(popup);
    }


}
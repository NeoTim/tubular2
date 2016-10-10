﻿import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormPopup, TubularGrid } from '../tubular'

@Component({
    selector: 'popup-details',
    templateUrl: '/app/popup.component.html'
})
export class Popup extends FormPopup {
    constructor(tbGrid: TubularGrid, formBuilder: FormBuilder) {
        super(tbGrid, formBuilder);
    }
}
﻿import { browser, element, by } from '../node_modules/protractor/built';

describe('grid sorting', () => {

    let dataSetLowerId = '1',
        dataSetHigherId = '53',
        dataSetLowerCustomerName = 'Advanced Technology Systems',
        dataSetHigherCustomerName = 'Vesta',
        dataSetLowerDate = 'Jan 27, 2016',
        dataSetHigherDate = 'May 24, 2016';

    let paginator = element(by.tagName('ngb-pagination')).$$('nav').$$('ul').$$('li'),
        columnHeaders = element(by.tagName('thead')).$$('tr').first().$$('th'),
        orderIdSorting = columnHeaders.get(1).$('.column-header').$$('span'),
        orderCustomerNameSorting = columnHeaders.get(2).$('.column-header').$$('span'),
        aShippedDateSorting = columnHeaders.get(3).$('.column-header').$$('span');

    beforeEach(() => {
        browser.refresh();
    });

    it('should order data in ascending order when click-sorting an unsorted numeric column', () => {
        orderIdSorting.click();
        let firstDataRow = element(by.tagName('tbody')).$$('tr').first();
        expect(firstDataRow.$$('td').get(1).getText()).toEqual(dataSetLowerId);
        paginator.last().$$('a').click();
        let lastDataRow = element(by.tagName('tbody')).$$('tr').last();
        expect(lastDataRow.$$('td').get(1).getText()).toEqual(dataSetHigherId);
    });

    it('should order data in descending order when click-sorting an ascending-sorted numeric column', () => {
        orderIdSorting.click();
        orderIdSorting.click();
        let firstDataRow = element(by.tagName('tbody')).$$('tr').first();
        expect(firstDataRow.$$('td').get(1).getText()).toEqual(dataSetHigherId);
        paginator.last().$$('a').click();
        let lastDataRow = element(by.tagName('tbody')).$$('tr').last();
        expect(lastDataRow.$$('td').get(1).getText()).toEqual(dataSetLowerId);
    });

    it('should order data in ascending order when click-sorting an unsorted text column', () => {
        orderCustomerNameSorting.click();
        let firstDataRow = element(by.tagName('tbody')).$$('tr').first();
        expect(firstDataRow.$$('td').get(2).getText()).toEqual(dataSetLowerCustomerName);
        paginator.last().$$('a').click();
        let lastDataRow = element(by.tagName('tbody')).$$('tr').last();
        expect(lastDataRow.$$('td').get(2).getText()).toEqual(dataSetHigherCustomerName);
    });

    it('should order data in descending order when click-sorting an ascending-sorted text column', () => {
        orderCustomerNameSorting.click();
        orderCustomerNameSorting.click();
        let firstDataRow = element(by.tagName('tbody')).$$('tr').first();
        expect(firstDataRow.$$('td').get(2).getText()).toEqual(dataSetHigherCustomerName);
        paginator.last().$$('a').click();
        let lastDataRow = element(by.tagName('tbody')).$$('tr').last();
        expect(lastDataRow.$$('td').get(2).getText()).toEqual(dataSetLowerCustomerName);
    });

    it('should order data in ascending order when click-sorting an unsorted date column', () => {
        aShippedDateSorting.click();
        let firstDataRow = element(by.tagName('tbody')).$$('tr').first();
        expect(firstDataRow.$$('td').get(3).getText()).toEqual(dataSetLowerDate);
        paginator.last().$$('a').click();
        let lastDataRow = element(by.tagName('tbody')).$$('tr').last();
        expect(lastDataRow.$$('td').get(3).getText()).toEqual(dataSetHigherDate);
    });

    it('should order data in descending order when click-sorting an ascending-sorted date column', () => {
        aShippedDateSorting.click();
        aShippedDateSorting.click();
        let firstDataRow = element(by.tagName('tbody')).$$('tr').first();
        expect(firstDataRow.$$('td').get(3).getText()).toEqual(dataSetHigherDate);
        paginator.last().$$('a').click();
        let lastDataRow = element(by.tagName('tbody')).$$('tr').last();
        expect(lastDataRow.$$('td').get(3).getText()).toEqual(dataSetLowerDate);
    });


});
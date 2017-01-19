import { browser, element, by } from '../../node_modules/protractor/built';

describe('tubular data service', () => {
    let userNameInput,
        passwordInput,
        loginBtn,
        labels

    beforeAll(() => {
        browser.get('/');
        userNameInput = element(by.tagName('login')).$$('input').first();
        passwordInput = element(by.tagName('login')).$$('input').last();
        loginBtn = element(by.tagName('login')).$$('button').first();
        labels = element(by.tagName('exp')).$('div').$$('label');
    });

    describe('authenticate services test', () => {
        beforeEach(() => {
            browser.get('/');
            element(by.tagName('nav')).$$('li').get(2).click();
        });

        it('should authenticate', () => {
            userNameInput.sendKeys('admin');
            passwordInput.sendKeys('pass.word');
            loginBtn.click();
            element(by.id('btnAuth')).click();
            expect(labels.first().getText()).toMatch('valid session');
        });

        it('should not authenticate aith bad credentials', () => {
            userNameInput.sendKeys('admin');
            passwordInput.sendKeys('pass.');
            loginBtn.click();
            expect(element(by.tagName('exp')).isPresent()).toBe(false);
        });

        it('should expired', () => {
            userNameInput.sendKeys('admin');
            passwordInput.sendKeys('pass.word');
            loginBtn.click();
            element(by.id('btnExp')).click();
            element(by.id('btnAuth')).click();
            expect(labels.first().getText()).toMatch('invalid session');
        });

        // it('should retrieve data',() => {
        //     userNameInput.sendKeys('admin');
        //     passwordInput.sendKeys('pass.word');
        //     loginBtn.click();
        //     element(by.id('btnRetData')).click();
        //     expect(labels.last().getText()).toMatch('admin')
        // });
    });

});

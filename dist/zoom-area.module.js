import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ZoomAreaComponent } from './zoom-area.component';
import { ZoomAreaProvider } from './zoom-area.provider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
var ZoomAreaModule = /** @class */ (function () {
    function ZoomAreaModule() {
    }
    ZoomAreaModule.forRoot = function () {
        return {
            ngModule: ZoomAreaModule,
            providers: [
                ZoomAreaProvider
            ]
        };
    };
    ZoomAreaModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        ZoomAreaComponent
                    ],
                    imports: [
                        IonicModule,
                        BrowserAnimationsModule
                    ],
                    exports: [
                        ZoomAreaComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    ZoomAreaModule.ctorParameters = function () { return []; };
    return ZoomAreaModule;
}());
export { ZoomAreaModule };
//# sourceMappingURL=zoom-area.module.js.map
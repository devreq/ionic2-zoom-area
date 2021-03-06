import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
var ZoomAreaProvider = /** @class */ (function () {
    function ZoomAreaProvider() {
        this.SCROLL_STATE = {
            NORMAL: 'scrollNormal',
            COLAPSED: 'scrollColapsed'
        };
        this._onScroll = new Subject();
        this.onScroll$ = this._onScroll.asObservable();
        this._scrollState = new Subject();
        this.scrollState$ = this._scrollState.asObservable();
    }
    ZoomAreaProvider.prototype.notifyScroll = function (data) {
        this._onScroll.next(data);
    };
    ZoomAreaProvider.prototype.notifyScrollState = function (data) {
        this._scrollState.next(data);
    };
    ZoomAreaProvider.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ZoomAreaProvider.ctorParameters = function () { return []; };
    return ZoomAreaProvider;
}());
export { ZoomAreaProvider };
//# sourceMappingURL=zoom-area.provider.js.map
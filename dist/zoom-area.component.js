import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Gesture, Content } from 'ionic-angular';
import { ZoomAreaProvider } from './zoom-area.provider';
var ZoomAreaComponent = /** @class */ (function () {
    function ZoomAreaComponent(zoomAreaProvider) {
        this.zoomAreaProvider = zoomAreaProvider;
        this.afterZoomIn = new EventEmitter();
        this.afterZoomOut = new EventEmitter();
        this.controlsChanged = new EventEmitter();
        this.scaleChanged = new EventEmitter();
        this.zoomConfig = {
            ow: 0,
            oh: 0,
            original_x: 0,
            original_y: 0,
            max_x: 0,
            max_y: 0,
            min_x: 0,
            min_y: 0,
            x: 0,
            y: 0,
            last_x: 0,
            last_y: 0,
            scale: 1,
            base: 1,
        };
        this.zoomControlsState = 'hidden';
    }
    ZoomAreaComponent.prototype.ngOnChanges = function (changes) {
        if ('controls' in changes) {
            var showControls = changes['controls'];
            if (showControls && showControls.currentValue) {
                this.zoomControlsState = 'shown';
            }
            else {
                this.zoomControlsState = 'hidden';
            }
        }
        if ('scale' in changes) {
            var scaleValue = changes['scale'];
            if (scaleValue && scaleValue.currentValue && scaleValue.currentValue === 1) {
                this.zoomReset();
            }
        }
    };
    ZoomAreaComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.content.ionScroll.subscribe(function (data) {
            _this.zoomAreaProvider.notifyScroll(data);
        });
        this._pinchZoom(this.zoom.nativeElement, this.content);
    };
    ZoomAreaComponent.prototype.toggleZoomControls = function () {
        this.zoomControlsState = this.zoomControlsState === 'shown' ? 'hidden' : 'shown';
    };
    ZoomAreaComponent.prototype.zoomIn = function () {
        this.zoomConfig.scale += 1;
        if (this.zoomConfig.scale > 1) {
            this.zoomAreaProvider.notifyScrollState(this.zoomAreaProvider.SCROLL_STATE.COLAPSED);
        }
        if (this.zoomConfig.scale > 4) {
            this.zoomConfig.scale = 4;
        }
        this.transform();
        this.afterZoomIn.emit();
    };
    ZoomAreaComponent.prototype.zoomOut = function (reset) {
        if (!this.zoomRootElement) {
            return;
        }
        this.zoomConfig.scale -= 1;
        if (this.zoomConfig.scale < 1) {
            this.zoomConfig.scale = 1;
        }
        if (this.zoomConfig.scale === 1) {
            reset = true;
            this.zoomAreaProvider.notifyScrollState(this.zoomAreaProvider.SCROLL_STATE.NORMAL);
        }
        reset ? this.transform(0.1, 0.1) : this.transform();
        this.afterZoomOut.emit();
    };
    ZoomAreaComponent.prototype.zoomReset = function () {
        this.zoomConfig.scale = 1;
        if (this.content && this.content.scrollTop) {
            this.content.scrollTop = 0;
        }
        this.zoomOut(true);
    };
    ZoomAreaComponent.prototype._pinchZoom = function (elm, content) {
        this.zoomRootElement = elm;
        this.gesture = new Gesture(this.zoomRootElement);
        for (var i = 0; i < elm.children.length; i++) {
            var c = elm.children.item(i);
            this.zoomConfig.ow = c.offsetWidth;
            this.zoomConfig.oh += c.offsetHeight;
        }
        this.zoomConfig.original_x = content.contentWidth - this.zoomConfig.ow;
        this.zoomConfig.original_y = content.contentHeight - this.zoomConfig.oh;
        this.zoomConfig.max_x = this.zoomConfig.original_x;
        this.zoomConfig.max_y = this.zoomConfig.original_y;
        this.zoomConfig.base = this.zoomConfig.scale;
        this.gesture.listen();
        this.gesture.on('pan', this.onPan.bind(this));
        this.gesture.on('panend', this.onPanend.bind(this));
        this.gesture.on('pancancel', this.onPanend.bind(this));
        this.gesture.on('tap', this.onTap.bind(this));
        this.gesture.on('pinch', this.onPinch.bind(this));
        this.gesture.on('pinchend', this.onPinchend.bind(this));
        this.gesture.on('pinchcancel', this.onPinchend.bind(this));
    };
    ZoomAreaComponent.prototype.onPan = function (ev) {
        if (this.zoomConfig.scale === 1) {
            return;
        }
        this.setCoor(ev.deltaX, ev.deltaY);
        this.transform();
    };
    ZoomAreaComponent.prototype.onPanend = function () {
        this.zoomConfig.last_x = this.zoomConfig.x;
        this.zoomConfig.last_y = this.zoomConfig.y;
    };
    ZoomAreaComponent.prototype.onTap = function (ev) {
        if (ev && ev.tapCount > 1) {
            var reset = false;
            this.zoomConfig.scale += .5;
            if (this.zoomConfig.scale > 2) {
                this.zoomConfig.scale = 1;
                reset = true;
            }
            this.setBounds();
            reset ? this.transform(this.zoomConfig.max_x / 2, this.zoomConfig.max_y / 2) : this.transform();
        }
    };
    ZoomAreaComponent.prototype.onPinch = function (ev) {
        this.zoomConfig.scale = this.zoomConfig.base + (ev.scale * this.zoomConfig.scale - this.zoomConfig.scale) / this.zoomConfig.scale;
        this.setBounds();
        this.transform();
    };
    ZoomAreaComponent.prototype.onPinchend = function (ev) {
        if (this.zoomConfig.scale > 4) {
            this.zoomConfig.scale = 4;
        }
        if (this.zoomConfig.scale < 1) {
            this.zoomConfig.scale = 1;
        }
        this.zoomConfig.base = this.zoomConfig.scale;
        this.setBounds();
        this.transform();
    };
    ZoomAreaComponent.prototype.setBounds = function () {
        var scaled_x = Math.ceil((this.zoomRootElement.offsetWidth * this.zoomConfig.scale - this.zoomRootElement.offsetWidth) / 2);
        var scaled_y = Math.ceil((this.zoomRootElement.offsetHeight * this.zoomConfig.scale - this.zoomRootElement.offsetHeight) / 2);
        var overflow_x = Math.ceil(this.zoomConfig.original_x * this.zoomConfig.scale - this.zoomConfig.original_x);
        var overflow_y = Math.ceil(this.zoomConfig.oh * this.zoomConfig.scale - this.zoomConfig.oh);
        this.zoomConfig.max_x = this.zoomConfig.original_x - scaled_x + overflow_x;
        this.zoomConfig.min_x = 0 + scaled_x;
        this.zoomConfig.max_y = this.zoomConfig.original_y + scaled_y - overflow_y;
        this.zoomConfig.min_y = 0 + scaled_y;
        this.setCoor(-scaled_x, scaled_y);
    };
    ZoomAreaComponent.prototype.setCoor = function (xx, yy) {
        this.zoomConfig.x = Math.min(Math.max((this.zoomConfig.last_x + xx), this.zoomConfig.max_x), this.zoomConfig.min_x);
        this.zoomConfig.y = Math.min(Math.max((this.zoomConfig.last_y + yy), this.zoomConfig.max_y), this.zoomConfig.min_y);
    };
    ZoomAreaComponent.prototype.transform = function (xx, yy) {
        this.zoomRootElement.style.transform = "translate3d(" + (xx || this.zoomConfig.x) + "px, " + (yy || this.zoomConfig.y) + "px, 0) scale3d(" + this.zoomConfig.scale + ", " + this.zoomConfig.scale + ", 1)";
    };
    ZoomAreaComponent.decorators = [
        { type: Component, args: [{
                    selector: 'zoom-area',
                    template: "\n    <ion-content>\n      <div #zoomAreaRoot class=\"zoom\" (click)=\"toggleZoomControls()\">\n          <div class=\"fit\">\n              <ng-content></ng-content>\n          </div>\n      </div>\n\n      <ion-fab right top [@visibilityChanged]=\"zoomControlsState\">\n          <button (click)=\"zoomIn()\" ion-fab color=\"primary\" [hidden]=\"true\" class=\"btn-zoom\">\n              <ion-icon name=\"add-circle\"></ion-icon>\n          </button>\n\n          <button (click)=\"zoomOut()\" ion-fab color=\"primary\" [hidden]=\"true\" class=\"btn-zoom\">\n              <ion-icon name=\"remove-circle\"></ion-icon>\n          </button>\n\n          <button (click)=\"zoomReset()\" ion-fab color=\"primary\" class=\"btn-zoom\">\n              <ion-icon name=\"md-contract\"></ion-icon>\n          </button>\n      </ion-fab>\n    </ion-content>\n",
                    animations: [
                        trigger('visibilityChanged', [
                            state('shown', style({ opacity: 1, display: 'block' })),
                            state('hidden', style({ opacity: 0, display: 'none' })),
                            transition('shown => hidden', animate('300ms')),
                            transition('hidden => shown', animate('300ms')),
                        ])
                    ],
                    styles: [
                        "\n  :host {\n    display: block;\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n  }\n  "
                    ]
                },] },
    ];
    /** @nocollapse */
    ZoomAreaComponent.ctorParameters = function () { return [
        { type: ZoomAreaProvider, },
    ]; };
    ZoomAreaComponent.propDecorators = {
        'zoom': [{ type: ViewChild, args: ['zoomAreaRoot',] },],
        'content': [{ type: ViewChild, args: [Content,] },],
        'afterZoomIn': [{ type: Output },],
        'afterZoomOut': [{ type: Output },],
        'controls': [{ type: Input },],
        'controlsChanged': [{ type: Output },],
        'scale': [{ type: Input },],
        'scaleChanged': [{ type: Output },],
    };
    return ZoomAreaComponent;
}());
export { ZoomAreaComponent };
//# sourceMappingURL=zoom-area.component.js.map
import { Observable } from 'rxjs/Rx';
export declare class ZoomAreaProvider {
    SCROLL_STATE: {
        NORMAL: string;
        COLAPSED: string;
    };
    private _onScroll;
    onScroll$: Observable<any>;
    private _scrollState;
    scrollState$: Observable<any>;
    constructor();
    notifyScroll(data: any): void;
    notifyScrollState(data: any): void;
}

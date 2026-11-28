// Double-tap & Drag zoom handler

const DOUBLE_TAP_DELAY = 300; // ms between first tap release and second touch
const DOUBLE_TAP_DISTANCE = 40; // px between first tap and second touch
const TAP_MAX_DURATION = 250; // ms a touch may last and still count as a tap
const TAP_MAX_MOVE = 10; // px a touch may move and still count as a tap
const DRAG_THRESHOLD = 8; // px of vertical movement before zooming starts
const PX_PER_ZOOM_LEVEL = 100; // vertical drag distance for one zoom level
const CLICK_SUPPRESS_WINDOW = 500; // ms after a drag-zoom to swallow click/dblclick

export function enableDoubleTapDragZoom(L: any, map: any): () => void {
    const container: HTMLElement = map.getContainer();
    const activePointers = new Set<number>();

    // First tap tracking
    let tapStart: { id: number; x: number; y: number; time: number } | null = null;
    let lastTap: { x: number; y: number; time: number } | null = null;

    // Gesture state
    let armedPointerId: number | null = null;
    let zooming = false;
    let startY = 0;
    let startZoom = 0;
    let center: any;
    let zoom = 0;
    let animRequest: number | null = null;
    let suppressClicksUntil = 0;

    function onPointerDown(e: PointerEvent) {
        if (e.pointerType !== "touch") return;
        activePointers.add(e.pointerId);

        // A second finger means a pinch: hand over to Leaflet
        if (activePointers.size > 1) {
            if (armedPointerId !== null) finish();
            tapStart = null;
            lastTap = null;
            return;
        }

        const now = Date.now();
        if (lastTap
            && now - lastTap.time < DOUBLE_TAP_DELAY
            && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < DOUBLE_TAP_DISTANCE) {
            armedPointerId = e.pointerId;
            zooming = false;
            startY = e.clientY;
            startZoom = map.getZoom();
            map._stop();
            center = map.getCenter();
            if (map.dragging.enabled()) map.dragging.disable();
            lastTap = null;
            tapStart = null;
            return;
        }

        tapStart = { id: e.pointerId, x: e.clientX, y: e.clientY, time: now };
    }

    function onPointerMove(e: PointerEvent) {
        if (e.pointerId !== armedPointerId) return;

        const dy = e.clientY - startY;
        if (!zooming) {
            if (Math.abs(dy) < DRAG_THRESHOLD) return;
            zooming = true;
            map._moveStart(true, false);
        }

        zoom = Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), startZoom + dy / PX_PER_ZOOM_LEVEL));
        if (animRequest !== null) L.Util.cancelAnimFrame(animRequest);
        animRequest = L.Util.requestAnimFrame(() => {
            animRequest = null;
            map._move(center, zoom, { pinch: true, round: false });
        });
        e.preventDefault();
    }

    function onPointerUp(e: PointerEvent) {
        if (e.pointerType !== "touch") return;
        activePointers.delete(e.pointerId);

        if (e.pointerId === armedPointerId) {
            finish();
            return;
        }

        if (tapStart && tapStart.id === e.pointerId) {
            const isTap = e.type === "pointerup"
                && Date.now() - tapStart.time < TAP_MAX_DURATION
                && Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y) < TAP_MAX_MOVE;
            lastTap = isTap ? { x: e.clientX, y: e.clientY, time: Date.now() } : null;
            tapStart = null;
        }
    }

    function finish() {
        armedPointerId = null;
        map.dragging.enable();
        if (!zooming) return; // plain double tap: Leaflet's dblclick zoom handles it

        zooming = false;
        suppressClicksUntil = Date.now() + CLICK_SUPPRESS_WINDOW;
        if (animRequest !== null) {
            L.Util.cancelAnimFrame(animRequest);
            animRequest = null;
        }
        if (map.options.zoomAnimation) {
            map._animateZoom(center, map._limitZoom(zoom), true, map.options.zoomSnap);
        } else {
            map._resetView(center, map._limitZoom(zoom));
        }
    }

    // The second tap of a drag-zoom must not also trigger a dblclick zoom
    function onClick(e: MouseEvent) {
        if (Date.now() < suppressClicksUntil) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }

    const capture = { capture: true };
    container.addEventListener("pointerdown", onPointerDown, capture);
    container.addEventListener("click", onClick, capture);
    container.addEventListener("dblclick", onClick, capture);
    window.addEventListener("pointermove", onPointerMove, { capture: true, passive: false });
    window.addEventListener("pointerup", onPointerUp, capture);
    window.addEventListener("pointercancel", onPointerUp, capture);

    return () => {
        container.removeEventListener("pointerdown", onPointerDown, capture);
        container.removeEventListener("click", onClick, capture);
        container.removeEventListener("dblclick", onClick, capture);
        window.removeEventListener("pointermove", onPointerMove, capture);
        window.removeEventListener("pointerup", onPointerUp, capture);
        window.removeEventListener("pointercancel", onPointerUp, capture);
        if (animRequest !== null) L.Util.cancelAnimFrame(animRequest);
    };
}

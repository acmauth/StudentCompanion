/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/HBLdITkkTnLs4M09BmCe4h
 */
import { escape } from '../escape';
import type { PartDict } from '../types';
export const style: PartDict = {
    circle: (components, colors) => { var _a, _b; return `<circle cx="132" cy="160" r="120" fill="${escape.xml(`${colors.background}`)}"/><mask id="styleCircle-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="264" height="280"><path d="M264 0H0v160h12c0 66.27 53.73 120 120 120 66.27 0 120-53.73 120-120h12V0Z" fill="#fff"/></mask><g mask="url(#styleCircle-a)">${(_b = (_a = components.base) === null || _a === void 0 ? void 0 : _a.value(components, colors)) !== null && _b !== void 0 ? _b : ''}</g>`; },
    default: (components, colors) => { var _a, _b; return `${(_b = (_a = components.base) === null || _a === void 0 ? void 0 : _a.value(components, colors)) !== null && _b !== void 0 ? _b : ''}`; },
};

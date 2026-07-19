# Custom vectors

Drop an `.svg` file into a category folder here and it automatically becomes a
selectable option in the UI — no code changes needed.

```
parts/custom/
  top/        my-hat.svg        -> appears under "Top / Hair"
  accessories/laser-visor.svg   -> appears under "Accessories"
  eyes/  eyebrows/  nose/  mouth/  clothing/  facialHair/
```

The folder name must match a category key (`top`, `accessories`, `facialHair`,
`clothing`, `clothingGraphic`, `mouth`, `nose`, `eyes`, `eyebrows`, `style`).
The file name (without `.svg`) becomes the option id shown in the dropdown.

## Coordinate space

Each part is composited inside the category's own transform, matching the stock
avataaaars layout. Author your vector in the **same local coordinate space** as
the stock parts for that category (the canvas is `0 0 280 280`, and the body is
shifted by `translate(8)`). The easiest way to get coordinates right is to copy
a stock part from `../<category>.ts` and edit its paths.

Category transforms (applied automatically, from `base`):

| Category    | transform              |
| ----------- | ---------------------- |
| clothing    | `translate(0 170)`     |
| mouth       | `translate(78 134)`    |
| nose        | `translate(104 122)`   |
| eyes        | `translate(76 90)`     |
| eyebrows    | `translate(76 82)`     |
| top         | `translate(-1 0)`      |
| facialHair  | `translate(49 72)`     |
| accessories | `translate(62 42)`     |

## Theming with colors

To make part of your vector follow the avatar's color pickers, use a token as
the fill value. Tokens are replaced at render time:

`{{skin}}`, `{{hair}}`, `{{hat}}`, `{{clothes}}`, `{{accessories}}`,
`{{facialHair}}`, `{{background}}`

```svg
<svg xmlns="http://www.w3.org/2000/svg">
  <path d="..." fill="{{hair}}" />
  <path d="..." fill="#000" fill-opacity=".2" />
</svg>
```

The outer `<svg>` wrapper is stripped automatically; only its inner contents are
used.

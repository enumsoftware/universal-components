# UcFilePicker

A drag-and-drop file upload zone with image preview and an optional built-in image editor.

## Features

- **Drag-and-drop**: Full drag-over / drag-leave / drop support on the host element
- **Click-to-browse**: Triggers the native file input programmatically
- **Image preview**: Shows a thumbnail of the selected file
- **File size validation**: Optional `maxFileSizeBytes` guard
- **Image editor**: Opens `UcImageEditorDialog` when `editImages` is `true`
- **Accessible**: Associates label with the underlying `<input type="file">`

## Usage

```typescript
import { UcFilePicker } from '@enumsoftware/universal-components';

@Component({
  imports: [UcFilePicker],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```html
<uc-file-picker id="avatar" label="Upload photo" (fileChanged)="onFile($event)" />
```

### With image editing

```html
<uc-file-picker
  id="profile-pic"
  label="Profile picture"
  [editImages]="true"
  imageEditorTitle="Crop your photo"
  (fileChanged)="onFile($event)"
/>
```

### File size limit

```html
<uc-file-picker
  id="doc"
  accept=".pdf,.docx"
  [maxFileSizeBytes]="5_000_000"
  helperText="Max 5 MB"
  (fileChanged)="onFile($event)"
/>
```

## API

### Inputs

| Input               | Type             | Default                      | Description                                              |
|---------------------|------------------|------------------------------|----------------------------------------------------------|
| `id`                | `string`         | Required                     | Unique id for the hidden file input                      |
| `label`             | `string`         | `'Choose file'`              | Visible label text                                       |
| `accept`            | `string`         | `'image/*,image/svg+xml'`    | MIME types / file extensions accepted                    |
| `helperText`        | `string`         | `''`                         | Secondary hint text shown below the drop zone            |
| `disabled`          | `boolean`        | `false`                      | Disables the picker                                      |
| `maxFileSizeBytes`  | `number \| null` | `null`                       | Maximum allowed file size in bytes; `null` = unlimited   |
| `editImages`        | `boolean`        | `false`                      | Opens the image editor dialog after selection            |
| `imageEditorTitle`  | `string`         | `'Edit image'`               | Title shown in the image editor dialog                   |

### Outputs

| Name           | Type           | Description                                              |
|----------------|----------------|----------------------------------------------------------|
| `fileSelected` | `string \| null` | Emits a data-URL string (or `null`) after selection    |
| `fileChanged`  | `File \| null`   | Emits the raw `File` object (or `null`) after selection|

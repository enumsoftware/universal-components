A controlled pager: it shows `currentPage` (0-based) of `totalItems` split into
`pageSize` pages, and reports `pageChange` and `pageSizeChange` for the caller to
feed back in.

Every text can be replaced, for apps in other languages. The jump labels may use
`{count}` for the number of pages skipped, and `pageInfoTemplate` uses
`{currentPage}` and `{totalPages}`:

```html
<uc-pagination
  [currentPage]="page()"
  [totalItems]="total()"
  [pageSize]="pageSize()"
  pageInfoTemplate="Stranica {currentPage} od {totalPages}"
  previousPageLabel="Prethodna stranica"
  nextPageLabel="Sljedeća stranica"
  jumpBackwardLabel="{count} stranice unatrag"
  jumpForwardLabel="{count} stranice naprijed"
  pageSizeLabel="Po stranici"
  pageSizeSelectLabel="Odaberite broj po stranici"
  (pageChange)="page.set($event)"
  (pageSizeChange)="changePageSize($event)"
/>
```

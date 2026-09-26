A controlled pager: it shows `currentPage` (0-based) of `totalItems` split into
`pageSize` pages, and reports `pageChange` and `pageSizeChange` for the caller to
feed back in.

## A single page

By default the whole paginator is hidden while every item fits on one page, since
there is nothing to page through. It stays shown while a smaller page size would
split the items again: with 40 items at 100 per page there is one page, but the
page size selector is kept so the user can go back to 10 per page. With
`showPageSelector` off, a single page is always hidden.

Set `hideSinglePage` to `false` to always show the paginator:

```html
<uc-pagination [currentPage]="page()" [totalItems]="total()" [pageSize]="10" [hideSinglePage]="false" />
```

Every text can be replaced, for apps in other languages. The jump labels may use
`{count}` for the number of pages skipped, and `pageInfoTemplate` uses
`{currentPage}`, `{totalPages}` and `{totalItems}` (the number of items, for a total such as "40 results"):

```html
<uc-pagination
  [currentPage]="page()"
  [totalItems]="total()"
  [pageSize]="pageSize()"
  pageInfoTemplate="Stranica {currentPage} od {totalPages} · Ukupno {totalItems}"
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

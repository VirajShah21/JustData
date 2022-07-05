# JDScript Documentation

## Getting Started

JDScript (Just Data Script) is a scripting language designed to scrape websites. The JDScript
Runtime is a program written in TypeScript that executes each command in the script. The JDScript
runtime is only meant to be used to scrape websites and not as a general-purpose programming
language.

JDScript files use the extension `*.jds` – as of right now this file extension does not matter,
but should be used for future compatibility.

The syntax is quite simple. Every line strictly issues a new command. Multiple commands cannot be
written on the same line. The syntax for each command is `[command]: [arguments]`.

Every JDScript file should begin with the following commands:

```
origin: [url]
expiration: [expiration string]
```

-   The `origin` command sets the URL of the webpage to open. The URL can be changed within the
    JDScript by simulating searches or clicking on hyperlinks. This is the initial URL that the
    scraper should navigate to.
-   The `expiration` command sets the expiration date for the scraped data. This is used by the
    scrapers to determine when data should be deleted from the database and scraped again. For
    example, a scraper that finds a price of a stock should expirer sooner than a scraper that
    finds the ticker symbol of a stock; stock prices change every second while ticker symbols
    rarely change.

The format for the expiration URL is:

```
[seconds]s [minutes]min [hours]h [days]d [weeks]w [months]m [years]y
```

You can use a single unit of time or multiple units of time and order does not matter.

## Commands

-   `field` – Assigns a field to the scraper.
-   `var` – Assigns a local variable.
-   `open` – Opens the webpage.
-   `close` – Closes the webpage.
-   `select` – Selects an element matching the query selector from the interactive webpage.
-   `select_all` – Selects all elements matching the query selector from the interactive webpage.
-   `select_from` – Selects an element matching the query selector from a static node – an already
    selected element.
-   `select_all_from` – Selects all elements matching the query selector from a static node – an
-   already selected element.
-   `save_selection` – Saves the selected element to a variable.
-   `attr` – Gets the attribute of a selected element.

## Commmand Documentation

### field

#### Syntax

```
field: [name] [value]
```

### Description

Assigns a field name and value to the scraper. The field name cannot be changed. For mutable
values, use `var` instead.

The `value` can be a string, number, or boolean. If the `name` begins with a question mark (`?`), a
reference to a URL parameter can be used. For example, if the API url is
`https://just-data.com/api/myscraper?query=Hello%20World`, then the following can be used to access
the URL parameter:

```
field: ?search_terms query
```

#### Arguments

-   `name: string` – The name of the field.
-   `value: string | number | boolean` – The value of the field.

### var

#### Syntax

```
var: [name] [value]
```

#### Description

Assign a mutable local variable. If the variable doesn't exist then it will be created. The `value`
can be a string, number, or boolean. If `value` is `"true"` or `"false"`, then it will be converted
to a boolean. If the `value` is a number, then it will be converted to a number. Otherwise, it will
be kept as a string.

#### Arguments

-   `name: string` – The name of the variable.
-   `value: string | number | boolean` – The value of the variable.

### open

#### Syntax

```
open
```

#### Description

Opens the `origin` URL in a headless Chromium-based browser. The `origin` must be set before `open`
can is invoked; otherwise an error will be thrown.

### close

#### Syntax

```
close
```

#### Description

Closes the webpage in the headless browser. If the webpage is already closed, then nothing this
command will do nothing.

### select

#### Syntax

```
select: [query_selector]
```

#### Description

Uses a query selector to select an element from the interactive webpage. The element will be
converted to a static node. This means any changes to the element on the live site will not
impact the selected element, and vice versa.

#### Arguments

-   `query_selector: string` – The query selector to use to select the element.

### select_all

#### Syntax

```
select_all: [query_selector]
```

#### Description

Uses a query selector to select all elements from the interactive webpage. The elements will be
converted to static nodes. This means any changes to the elements on the live site will not
impact the selected elements, and vice versa.

#### Arguments

-   `query_selector: string` – The query selector to use to select the elements.

### select_from

#### Syntax

```
select_from: [selection] [query_selector]
```

#### Description

Uses a query selector to select an element from a static node that has been copied to memory.

#### Arguments

-   `selection: string` – The name of the variable that contains the static node.
-   `query_selector: string` – The query selector to use to select the element.

### select_all_from

#### Syntax

```
select_all_from: [selection] [query_selector]
```

#### Description

Uses a query selector to select all elements from a static node that has been copied to memory.

#### Arguments

-   `selection: string` – The name of the variable that contains the static node.
-   `query_selector: string` – The query selector to use to select the elements.

### save_selection

#### Syntax

```
save_selection: [name]
```

#### Description

Saves the last selected element to a local variable.

#### Arguments

-   `name: string` – The name of the variable to save the selected element to.

### attr

#### Syntax

```
attr: [name] [selection?]
```

#### Description

Retrieves the value of an element's attribute. If a `selection` is provided, then the command will
use the selected element as its target. If no `selection` is defined, then the command uses the
last selected element.

If the `selection` or last selected element is a `Collection` or `NodeList` then the `attr` command
is applied to each element and returned as a string.

# Section anchors for the GHL page

Every section link on the site (sticky navbar, hero menu, footer) scrolls the GHL page to an element with that **id**.
If the id is not on the page, the link does nothing. This file lists what to paste, and where.

The navbar's links scroll to: `#about` `#services` `#portfolio` `#team` `#blog` `#contact`.
The hero menu and the footer also use: `#integrations` `#calendar` `#career` `#terms` `#privacy`.

> One id = one place on the page. Never paste the same id twice.

---

## 1. Our own sections (Custom HTML elements we made)

Replace the whole content of these elements with the new version of the file. The anchor is the first line of each file.

| id | GHL element | Paste the whole file |
|---|---|---|
| `#about` | Pillars | `ghl/pillars-embed.html` (now starts with `<div id="about"></div>`) |
| `#services` | Services | `ghl/services-embed.html` (now starts with `<div id="services"></div>`) |

The Bridge (`ghl/zyrex-ghl-bridge.html`) changed too: paste it into the **GHL Bridge** element again
(navbar links stop below the navbar when they scroll up, so it does not cover the top of the section).

---

## 2. Team and Integrations (one Custom HTML element each)

If these sections are already on the page as Custom HTML with an iframe, **replace** their content with the code below
(do not add a second Team or Integrations iframe).

### Team (`#team`)

```html
<div id="team"></div>
<iframe
  src="https://zyrex-it.vercel.app/embed/team"
  data-zyrex-embed="/embed/team"
  title="ZYREX IT team"
  scrolling="no"
  frameborder="0"
  style="display:block;width:100%;margin:0;padding:0;border:0"
></iframe>
```

### Integrations (`#integrations`)

```html
<div id="integrations"></div>
<iframe
  src="https://zyrex-it.vercel.app/embed/integrations"
  data-zyrex-embed="/embed/integrations"
  title="ZYREX IT integrations"
  scrolling="no"
  frameborder="0"
  style="display:block;width:100%;margin:0;padding:0;border:0"
></iframe>
```

The Bridge sets the height of both iframes by itself.

---

## 3. GHL-native sections (built in GHL, no iframe)

For each one: add a **Custom HTML / Code** element as the **first element at the top of that section**, and paste one line.
The empty div takes no space.

| Section | Paste |
|---|---|
| Portfolio | `<div id="portfolio"></div>` |
| Blog | `<div id="blog"></div>` |
| Contact (the form / booking section) | `<div id="contact"></div>` |
| Calendar (if you have one) | `<div id="calendar"></div>` |
| Career (if you have one) | `<div id="career"></div>` |
| Terms (if on this page) | `<div id="terms"></div>` |
| Privacy Policy (if on this page) | `<div id="privacy"></div>` |

Alternative for native sections: GHL section settings, field **Custom ID** (or "Element ID"), set to the same word without `#`.
Use one way or the other, not both.

`#about` is the Pillars section (above). If you prefer a separate GHL "About" section, put `<div id="about"></div>` there instead
and remove the first line from `ghl/pillars-embed.html`.

---

## 4. Check

Publish, open the live page, press Ctrl+Shift+R, then click every navbar link, the hero menu links and the footer links.
Each should glide to its section. Links whose section does not exist on the page do nothing.

# *PL0T* and **See the Data**

We have powerful GPU in our brain, let's use it.


# Demos

Notebook:
  **[Page](http://files.pl0t.com/view/samples/page/page.yml:view)**

Table:
  [Units](http://files.pl0t.com/view/samples/table/units.yml:view) |
  [CSV](http://files.pl0t.com/view/samples/table/units.csv:view) |
  [Countries](http://files.pl0t.com/view/samples/table/countries.yml:view)

Chart:
  [Bar](http://files.pl0t.com/view/samples/chart/bar.yml:view)

Text:
  [Markdown with Code and Math](http://files.pl0t.com/view/samples/text/text.md:view) |
  [This page itself](http://files.pl0t.com/view/samples/text/pl0t.md:view)


# How to use

---

A plot document is just a **plain html file**. You can open it **locally or share** on any site.

---

Use API for your language to create plot documents:

Language               | Note
---------------------- | --------------------------------------------------------------
[TypeScript][deno_api] | Deno, with types, schema validation and autocomplete.
[Ruby][ruby_api]       | Docs going to be available later, use [schema][schema] and examples.
[Nim][nim_api]         | Docs going to be available later, use [schema][schema] and examples.
[Crystal][crystal_api] | Docs going to be available later, use [schema][schema] and examples.
[Groovy][groovy_api]   | Docs going to be available later, use [schema][schema] and examples.

If you have **questions** feel free to [contact me](https://github.com/al6x/pl0t/issues).


# Share

You may use pl0t.com to share your documents.

1 Login [with Github](http://pl0t.com/login), you will be redirected to your subdomain

    http://your-subdomain.pl0t.com

2 Get [API token](http://pl0t.com/api_tokens)

    http://pl0t.com/api_tokens

3 Create Hello World to check if everything works as expected. Replace `your-subdomain`
and `your-api-token` with actual values

    curl \
    --request POST \
    --header "api_token: your-api-token" \
    --data "Hello **World**" \
    http://your-subdomain.pl0t.com/hello_world.md

4 See it in Browser, replace `your-subdomain` in URL with yours

    http://your-subdomain.pl0t.com/hello_world.md:view

You may set environment variable `plot_api_token` to store your API token.


# License

**FREE** for personal usage, non-commercial organisations and commercial businesses with annual
sales less than $1 million.

For commercial businesses with annual sales greather than $1 million, the first month is free,
after that it's $5 per developer per month.

If you use free version please don't hide or remove the **PL0T** brand at the bottom of the page.

[full license](https://github.com/al6x/pl0t/tree/main/license).


[deno_api]: https://github.com/al6x/pl0t/tree/main/api/deno
[ruby_api]: https://github.com/al6x/pl0t/tree/main/api/ruby
[nim_api]: https://github.com/al6x/pl0t/tree/main/api/nim
[crystal_api]: https://github.com/al6x/pl0t/tree/main/api/crystal
[groovy_api]: https://github.com/al6x/pl0t/tree/main/api/groovy

[schema]: https://github.com/al6x/pl0t/blob/main/files/view-1/schema/blocks.ts


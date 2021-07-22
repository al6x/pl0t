# *PL0T* and **See the Data**

We have powerful GPU in our brain, let's use it.

# Demos

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

1 **Login** [with Github](http://pl0t.com/login), you will be redirected to your subdomain

    http://your-subdomain.pl0t.com

2 **Get** [API token](http://pl0t.com/api_tokens)

    http://pl0t.com/api_tokens

3 **Create** Hello World to check if everything works as expected. Replace `your-subdomain`
and `your-api-token` with actual values

    curl \
    --request POST \
    --header "api_token: your-api-token" \
    --data "Hello **World**" \
    http://your-subdomain.pl0t.com/hello_world.md

4 **See it** in Browser, replace `your-subdomain` in URL with yours

    http://your-subdomain.pl0t.com/hello_world.md:view

Optionally, you may set environment variable `plot_api_token` to store your API token.

If you have **questions** feel free to [contact me](https://github.com/al6x/pl0t/issues).

# API

**TypeScript API** going to be available a bit later, use
[TypeScript Scheme](https://github.com/al6x/pl0t/blob/main/files/view/schema/blocks.ts)
to build and validate the data and post it like with `curl` example above.

**[Nim API](https://github.com/al6x/pl0t/tree/main/api)** docs going to be available later, use
[TypeScript Scheme](https://github.com/al6x/pl0t/blob/main/files/view/schema/blocks.ts) and
[Nim Test](https://github.com/al6x/pl0t/blob/main/api/nim/pl0t/test.nim) and
examples above as a reference.


# License

**Free** for personal usage, non-commercial organisations and commercial businesses with annual
sales less than $1 million.

For commercial businesses with annual sales greather than $1 million, the first month is free,
after that it's $5 per developer per month,
[full license](https://github.com/al6x/pl0t/tree/main/license).
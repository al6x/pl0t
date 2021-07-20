# PL0T and **See the Data**

We, humans, have powerful graphical processor in our brain. Let's use it to see the data.

# Demos

Table:
  [Units](http://files.pl0t.com/view/samples/table/units.yml:view),
  [CSV](http://files.pl0t.com/view/samples/table/units.csv:view),
  [Countries](http://files.pl0t.com/view/samples/table/countries.yml:view)

Chart:
  [Bar](http://files.pl0t.com/view/samples/chart/bar.yml:view)

Text:
  [Markdown with Code and Math](http://files.pl0t.com/view/samples/text/text.md:view),
  [This page](http://files.pl0t.com/view/samples/text/pl0t.md:view)


# How to use

1 **[Login](http://pl0t.com/login)** with Github, you will be redirected to your subdomain

    http://your-subdomain.pl0t.com

2 **[Get](http://pl0t.com/api_tokens)** API token

    http://pl0t.com/api_tokens

3 Create sample text to ensure verything works as expected.
Replace `your-subdomain` and `your-api-token` with actual values

    curl \
    --request POST \
    --header "api_token: your-api-token" \
    --data "Hello **World**" \
    http://your-subdomain.pl0t.com/hello_world.md

4 Open it in Browser, replace `your-subdomain` in URL with yours

    http://your-subdomain.pl0t.com/hello_world.md:view

5 Hint, optionally, you may set environment variable `$plot_api_token` to store your API token.

6 If you have question or need help feel free to **[contact](https://github.com/al6x/pl0t/issues)**

# API

**TypeScript API** going to be available a bit later, currently the
[TypeScript Scheme](https://github.com/al6x/pl0t/blob/main/files/view/schema/blocks.ts)
available.

**[Nim API](https://github.com/al6x/pl0t/tree/main/api)** docs going to be available later,
use [TypeScript Scheme](https://github.com/al6x/pl0t/blob/main/files/view/schema/blocks.ts) as reference
for now.


# License

**Free** for personal usage, non-commercial organisations and businesses with annual sales less
than $1 million.

For commercial businesses with annual sales greather than $1 million, the first month is free,
after that it's $5 per developer per month,
[full license](https://github.com/al6x/pl0t/tree/main/license).
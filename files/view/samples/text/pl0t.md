# Plot and **See the Data**

We, humans, have powerful graphical processor in our brain. Let's use it to see the data.

# Demos

Table:
  [Units](http://files.pl0t.com/samples/table/units.yml:view),
  [Countries](http://files.pl0t.com/samples/table/countries.yml:view)

# How to use

1 **[Login](http://pl0t.com/login)** with Github, you will be redirected to your subdomain

    http://your-subdomain.pl0t.com

2 **[Get](http://pl0t.com/api_tokens)** API token

    http://pl0t.com/api_tokens

3 Create sample table to ensure verything works as expected.
Replace `your-subdomain` and `your-api-token` with actual values

    curl \
    --request POST \
    --header "api_token: your-api-token" \
    --data "Hello **World**" \
    http://your-subdomain.pl0t.com/hello_world.md

4 Open table in Browser, replace `your-subdomain` in URL with yours

    http://your-subdomain.pl0t.com/hello_world.md:view

5 Use API in you language.

- [TypeScript Scheme](https://github.com/al6x/pl0t/blob/main/files/view/schema), full API going to
  be available a bit later
- [Nim API](https://github.com/al6x/pl0t/tree/main/api)

6 Hint, optionally, you may set environment variable `$plot_api_token` to store your API token.

7 If you have question or need help feel free to **[contact](https://github.com/al6x/pl0t/issues)**

# License

**Free** for personal usage, non-commercial organisations and businesses with annual sales less
than $1 million.

For commercial businesses with annual sales greather than $1 million, the first month is free,
after that it's $5 per developer per month,
[full license](https://github.com/al6x/pl0t/tree/main/license).
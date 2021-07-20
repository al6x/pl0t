- Use `serve`
- In dev run `bin/dev_build` to use full TailwindCSS
- In prod run `bin/prod_build` to minify TailwindCSS

Post files

```
curl \
--request POST \
--header "api_token: $plot_api_token" \
--data @/alex/projects/plot/client/public/samples/units.json \
http://demos.pl0t.com/units.json
```
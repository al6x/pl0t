PL0T and **See the Data**

# Example

![](screenshot.png)

```Java
import pl0t.Page;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Play {
  public static class Row {
    public String  name;
    public int     age;
    public int     hp;
    public boolean is_alive;

    public Row(String name, int age, int hp, boolean is_alive) {
      this.name = name; this.age = age; this.hp = hp; this.is_alive = is_alive;
    }
  }


  public static void main(String[] args) {
    Page page = new Page("Some page", "Some description");

    page.text("Some text",
      "Some formula $E=mc^2$\n" +
      "\n" +
      "Some code `puts 'Hello World'`"
    );


    // Data as TidyData or Array or Column Array
    Row[] table_data = {
      new Row("Jim Raynor",   30,    250, true),
      new Row("Angus Mengsk", 50,    100, false),
      new Row("Amon",         15000, 500, true),
    };
    page.table("Some table", table_data,
      "{\n" +
      "  columns: [\n" +
      "    { id: name },\n" +
      "    { id: age },\n" +
      "    { id: hp, format: { type: line, ticks: [100] } },\n" +
      "    { id: is_alive }\n" +
      "  ]\n" +
      "}"
    );


    // Data as TidyData or Array or Column Array
    Map<String, List<Integer>> chart_data = new HashMap<>();
    chart_data.put("a", List.of(1, 2, 3,  4, 5));
    chart_data.put("b", List.of(1, 3, 2, -1, 2));
    page.chart("Some chart", chart_data, "[\n" +
      "  bar,\n" +
      "  { x: a, type: nominal },\n" +
      "  { y: b }\n" +
      "]"
    );

    // Tiny black pixel encoded as base64 image.
    // page.image("Some image", "R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=");

    // Saving report as HTML file, open it the Browser to see the Notebook
    // You can publish Notebook by copying it to any Web Server
    page.save("play.html");
  }
}
```

For more examples checkout [online demos](http://pl0t.com).
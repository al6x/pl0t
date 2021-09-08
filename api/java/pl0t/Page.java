package pl0t;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintWriter;
import java.lang.reflect.*;
import java.util.*;

// Flexible JSON used, you can omit quotes
public class Page {
  private boolean _isFirst = true;
  private StringBuffer json = new StringBuffer();

  public Page(String title, String desc) {
    json.append(
      "{\n" +
      "  title: " + toJson(title) + ",\n" +
      "  desc:  " + toJson(desc) + ",\n" +
      "  page:  [\n\n"
    );
  }

  private void addBlock(String part) {
    if (_isFirst) _isFirst = false;
    else          json.append(",\n\n");
    json.append(part);
  }

  public void text(String id, String text) {
    addBlock(
      "{\n" +
      "  id:   " + toJson(id) + ",\n" +
      "  text: " + toJson(text) + ",\n" +
      "}"
    );
  }

  public void table(String id, Object data, String table) {
    addBlock(
      "{\n" +
      "  id:    " + toJson(id) + ",\n" +
      "  table: " + table.replace("\n", "\n  ") + ",\n" +
      "  data:  " + toJson(data) + "\n" +
      "}"
    );
  }

  public void chart(String id, Object data, String chart) {
    addBlock(
      "{\n" +
      "  id:    " + toJson(id) + ",\n" +
      "  chart: " + chart.replace("\n", "\n  ") + ",\n" +
      "  data:  " + toJson(data) + "\n" +
      "}"
    );
  }

  public void image(String id, String base64data) {
    addBlock(
      "{\n" +
      "  id:    " + toJson(id) + ",\n" +
      "  image: {\n" +
      "    base64: " + base64data + "\n" +
      "  }\n" +
      "}"
    );
  }

  public void save(String path) {
    String finished = json + "\n\n]}";
    String html = standalone
      .replace("{type}", "yaml")
      .replace("{data}", finished);

    try (
      PrintWriter writer = new PrintWriter(new FileOutputStream(path, false))
    ) {
      writer.write(html);
    } catch (FileNotFoundException e) {
      throw new RuntimeException(e);
    }
  }

  public static void p(Object o) {
    System.out.println(o);
  }

  public static String toJson(Object o) {
    StringBuffer buff = new StringBuffer();
    toJson(o, buff);
    return buff.toString();
  }

  private static void toJson(Object o, StringBuffer buff) {
    Class<?> klass = o.getClass();
    if (klass == String.class || klass == StringBuffer.class) { // String
      String s = o.toString().replaceAll("\n", "\\\\n");
      buff.append("\"").append(s).append("\"");
    } else if (klass.isArray()) { // Array
      buff.append("[");
      int len = Array.getLength(o);
      for (int i = 0; i < len; i++) {
        toJson(Array.get(o, i), buff);
        if (i < len - 1) buff.append(",");
      }
      buff.append("]");
    } else if (List.class.isAssignableFrom(klass)) { // List
      List<?> list = (List<?>) o; int len = list.size();
      buff.append("[");
      for (int i = 0; i < len; i++) {
        toJson(list.get(i), buff);
        if (i < len - 1) buff.append(",");
      }
      buff.append("]");
    } else if (Map.class.isAssignableFrom(klass)) { // Map
      Map<?, ?> map = (Map<?, ?>) o; Object[] keys = map.keySet().toArray(); int len = keys.length;
      buff.append("{");
      for (int i = 0; i < len; i++) {
        Object key = keys[i];
        buff.append("\"").append(key).append("\":");
        toJson(map.get(key), buff);
        if (i < len - 1) buff.append(",");
      }
      buff.append("}");
    } else if (klass.isPrimitive()) { // Primitive
      buff.append(o.toString());
    } else if (
        Integer.class == klass || Boolean.class == klass || Double.class == klass ||
        Float.class == klass
    ) { // Primitive wrapper
      buff.append(o.toString());
    } else { // Custom class
      buff.append("{");
      Field[] fields = o.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        Field field = fields[i]; Object v;
        if (field.getName().startsWith("_")) continue;
        buff.append("\"").append(field.getName()).append("\"").append(":");
        try { v = field.get(o); }
        catch (IllegalAccessException e) { throw new RuntimeException(e); }
        toJson(v, buff);
        if (i < fields.length - 1) buff.append(",");
      }
      buff.append("}");
    }
  }

  // standalone begin
  private static String standalone = (
    "<!DOCTYPE html>\n" + 
    "<html lang=\"en\">\n" + 
    "<head>\n" + 
    "  <meta charset=\"utf-8\">\n" + 
    "  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n" + 
    "\n" + 
    "  <title>pl0t</title>\n" + 
    "\n" + 
    "  <link rel=\"icon\" type=\"image/png\" href=\"http://files.pl0t.com/view-1/favicon.ico\">\n" + 
    "\n" + 
    "  <!-- PL0T begin -->\n" + 
    "  <script>\n" + 
    "    window.env = {\n" + 
    "      base_url: \"http://files.pl0t.com/view-1\"\n" + 
    "    }\n" + 
    "  </script>\n" + 
    "  <link rel=\"stylesheet\" href=\"http://files.pl0t.com/view-1/releases/2021-09-08-d32106/bundle.css\">\n" + 
    "  <script defer src=\"http://files.pl0t.com/view-1/releases/2021-09-08-d32106/bundle.js\"></script>\n" + 
    "  <!-- PL0T end -->\n" + 
    "</head>\n" + 
    "<body>\n" + 
    "\n" + 
    "<!-- PL0T data, type could be 'yaml', 'json' or 'md' -->\n" + 
    "<script id=\"data\" type=\"{type}\">\n" + 
    "{data}\n" + 
    "</script>\n" + 
    "\n" + 
    "\n" + 
    "<script>\n" + 
    "  window.on_plot_loaded = function() {\n" + 
    "    window.plot_api.run()\n" + 
    "  }\n" + 
    "</script>\n" + 
    "\n" + 
    "</body>\n" + 
    "</html>\n" + 
    "\n"
  );
  // standalone end
}

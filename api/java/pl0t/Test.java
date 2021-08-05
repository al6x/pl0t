package pl0t;

import java.io.*;
import java.lang.reflect.*;
import java.util.*;

public class Test {
  public static class Record {
    public String name = "Jim";
    public int    age  = 25;
  }

  public static class Data {
    public String              str    = "some";
    public ArrayList<Integer>  ilist  = new ArrayList<>();
    public int[]               iarray = {1, 2, 3};
    public boolean[]           barray = {true, false};
    public String[]            sarray = {"a", "b c"};
    public Record              record = new Record();
    public Record[]            rarray = {new Record()};
    public Map<String, Object> map    = new HashMap<>();

    public Data() {
      ilist.add(1);
      ilist.add(2);

      map.put("a", "b");
      int[] array = {1, 2, 3};
      map.put("a", array);
    }
  }

  public static void main(String[] args) {
    p(toJson(new Data()));
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
    if (klass == String.class) { // String
      buff.append("\"").append(o).append("\"");
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
        buff.append("\"").append(field.getName()).append("\"").append(":");
        try { v = field.get(o); }
        catch (IllegalAccessException e) { throw new RuntimeException(e); }
        toJson(v, buff);
        if (i < fields.length - 1) buff.append(",");
      }
      buff.append("}");
    }
  }
}

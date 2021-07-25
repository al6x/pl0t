import java.net.*
import java.net.http.*

fun view(data: String) {
  // How to post https://zetcode.com/kotlin/getpostrequest/
  val client = HttpClient.newBuilder().build();
  val request = HttpRequest.newBuilder()
      .uri(URI.create("http://al6x.pl0t.com/kotlin/table.yml"))
      .header("api_token", System.getenv("plot_api_token"))
      .POST(HttpRequest.BodyPublishers.ofString(data))
      .build()
  client.send(request, HttpResponse.BodyHandlers.ofString());
  // println(response.body())
}

fun main() {
  view("""
    table: {}
    data: [
      [1, 2]
    ]
  """.trimIndent()
  )
}
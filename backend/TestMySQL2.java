import java.sql.*;
public class TestMySQL2 {
  public static void main(String[] args) throws Exception {
    String url = "jdbc:mysql://localhost:3306/heatmap_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    Connection conn = DriverManager.getConnection(url, "root", "root");
    Statement st = conn.createStatement();
    ResultSet rs = st.executeQuery("SELECT DATABASE()") ;
    while (rs.next()) { System.out.println(rs.getString(1)); }
    conn.close();
  }
}

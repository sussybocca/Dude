import java.io.FileWriter;
import java.io.IOException;
import org.json.JSONArray;
import org.json.JSONObject;

public class WaveGenerator {
    public static void main(String[] args) throws IOException {
        JSONArray waves = new JSONArray();
        for(int i=1;i<=5;i++){
            JSONObject wave = new JSONObject();
            wave.put("wave", i);
            wave.put("enemies", i*10);
            waves.put(wave);
        }
        FileWriter file = new FileWriter("../data/enemies.json");
        file.write(waves.toString(2));
        file.close();
        System.out.println("✅ Enemy waves generated!");
    }
}
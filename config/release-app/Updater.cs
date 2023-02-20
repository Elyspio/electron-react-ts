using ReleaseApp.Updater;

namespace ReleaseApp;

public class UpdaterApi
{
    public static async Task Upload(string path, AppVersion version, AppArch arch)
    {
        try
        {
            var t = DateTime.Now;
            var api = new AppsClient { BaseUrl = "https://elyspio.fr/updater" };
            var bytes = File.ReadAllBytes(path);
            Console.WriteLine("Adding " + path);
            await api.AddAsync("Electron React TS Template", version.ToString(), arch, bytes);
            Console.WriteLine($"Added {path} in {(DateTime.Now - t).Seconds}s");
        }

        catch(Exception e)
        {
            Console.WriteLine($"Error in upload of {path}, retry in 1s");
            await Task.Delay(1000);
            await Upload(path, version, arch);
        }


    }
}

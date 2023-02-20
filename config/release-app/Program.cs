// See https://aka.ms/new-console-template for more information


using Newtonsoft.Json;
using ReleaseApp;
using ReleaseApp.Updater;
using System.Runtime.InteropServices;
using CommandLine;



internal class Program
{

    public class Options
    {
        [Option("minor", Required = false, HelpText = "Change minor version instead of revision number", Default = false)]
        public bool Minor { get; set; }
    }


    private static void Main(string[] args)
    {

        var arguments = Parser.Default.ParseArguments<Options>(args).Value;


        Console.WriteLine("Releasing Electron React TS Template");

        Console.WriteLine($"appDir    {Internal.AppDir}");
        Console.WriteLine($"configDir {Internal.ConfigDir}");
        Console.WriteLine($"dockerDir {Internal.DockerDir}");

        var oldVersion = Internal.GetRootVersion();

        var newVersion = new AppVersion
        {
            Major = oldVersion.Major,
            Minor = oldVersion.Minor,
            Revision = oldVersion.Revision,
            Raw = oldVersion.Raw,
        };


        if (arguments.Minor)
        {
            newVersion.Minor += 1;
        }
        else
        {
            newVersion.Revision += 1;
        }

        try
        {
            if (Directory.Exists(Internal.ReleasesDir)) Directory.Delete(Internal.ReleasesDir, true);

            Internal.UpdateVersions(newVersion);
            Docker.Stop(Internal.DockerDir);
            Docker.Run(Internal.DockerDir);
        }
        catch
        {
            Internal.UpdateVersions(oldVersion);
        }

        var tasks = new List<Task>();

        var files = Directory.GetFiles(Internal.ReleasesDir).Select(f => Path.Combine(Internal.ReleasesDir, f)).ToList();

        var winInstaller = files.Find(f => f.EndsWith(".exe") && f.Contains(newVersion.Raw));
        if (winInstaller != null)
        {
            tasks.Add(UpdaterApi.Upload(winInstaller, newVersion, AppArch.Win64));
        }

        var debInstaller = files.Find(f => f.EndsWith(".deb"));
        if (debInstaller != null)
        {
            tasks.Add(UpdaterApi.Upload(debInstaller, newVersion, AppArch.LinuxDeb));
        }

        var snapInstaller = files.Find(f => f.EndsWith(".snap") && f.Contains(newVersion.Raw));
        if (snapInstaller != null)
        {
            tasks.Add(UpdaterApi.Upload(snapInstaller, newVersion, AppArch.LinuxSnap));
        }

        var rpmInstaller = files.Find(f => f.EndsWith(".rpm") && f.Contains(newVersion.Raw));
        if (rpmInstaller != null)
        {
            tasks.Add(UpdaterApi.Upload(rpmInstaller, newVersion, AppArch.LinuxRpm));
        }


        Task.WaitAll(tasks.ToArray());
    }
}
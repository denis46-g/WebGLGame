using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;

namespace WebApplicationGame.Pages
{
    public class Scene : PageModel
    {
        public HtmlString OBJStoHTML(params string[] arr)
        {
            return new HtmlString(string.Join("", Array.ConvertAll(arr, path => "<div hidden>\n<img src=\"../Models/" + path + ".png\" id=\"textures_" + path + "\">\n<p id = \"" + path + "\" > " + System.IO.File.ReadAllText("wwwroot/Models/" + path + ".obj") + " </p> \n</div>")));
        }
    }
}

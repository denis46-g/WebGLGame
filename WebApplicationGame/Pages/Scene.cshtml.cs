using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplicationGame.Pages
{
    public class Scene : PageModel
    {
        public HtmlString OBJtoHTML(string path)
        {
            return new HtmlString("<div hidden>\n<img src=\"../Models/" + path + ".png\" id=\"textures_" + path + "\">\n<p id = \"" + path +"\" > " + System.IO.File.ReadAllText("wwwroot/Models/" + path + ".obj") + " </p> \n</div>");
        }
    }
}

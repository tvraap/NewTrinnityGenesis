using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace KE03_INTDEV_SE_1_Base.Pages
{
    public class assortimentModel : PageModel
    {
        private readonly ILogger<assortimentModel> _logger;

        public assortimentModel(ILogger<assortimentModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}

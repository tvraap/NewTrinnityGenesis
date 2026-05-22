using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace KE03_INTDEV_SE_1_Base.Pages
{
    public class WinkelwagenModel : PageModel
    {
        private readonly ILogger<WinkelwagenModel> _logger;

        public WinkelwagenModel(ILogger<WinkelwagenModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}

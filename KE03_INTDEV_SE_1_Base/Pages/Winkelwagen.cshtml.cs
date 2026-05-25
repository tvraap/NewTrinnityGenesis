using DataAccessLayer;
using DataAccessLayer.Interfaces;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace KE03_INTDEV_SE_1_Base.Pages
{
    public class WinkelwagenModel : PageModel
    {

        private readonly MatrixIncDbContext _context;
        private readonly ILogger<IndexModel> _logger;
        private readonly IOrderRepository _orderRepository;

        public IList<Order> Orders { get; set; }

        public WinkelwagenModel(MatrixIncDbContext context,ILogger<IndexModel> logger, IOrderRepository orderRepository)
        {
            _context = context;
            _logger = logger;
            _orderRepository = orderRepository;
            Orders = new List<Order>();

        }


        public void OnGet()
        {
            
                Orders = _orderRepository.GetAllOrders().ToList();

            }
        private class CartItem
        {
            public string Name { get; set; } = string.Empty;
            public int ProductId { get; set; }
            public string Price { get; set; } = "0";
            public int Quantity { get; set; }
        }

        public async Task<IActionResult> OnPostCheckoutAsync()
        {
            var cartJson = Request.Form["cart"].ToString();
            if (string.IsNullOrEmpty(cartJson))
            {
                return Page();
            }

            List<CartItem>? cart;
            try
            {
                var options = new JsonSerializerOptions
                {
                    NumberHandling = JsonNumberHandling.AllowReadingFromString
                };
                cart = JsonSerializer.Deserialize<List<CartItem>>(cartJson, options);
            }
            catch
            {
                cart = null;
            }

            if (cart == null || cart.Count == 0)
            {
                return Page();
            }

            int customerId = 1; // Replace with actual customer ID
            var order = new Order
            {
                CustomerId = customerId,
                OrderDate = DateTime.Now
            };

            foreach (var item in cart)
            {
                decimal priceDecimal = 0m;
                Decimal.TryParse(item.Price, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out priceDecimal);

                order.OrderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = priceDecimal
                });
            }

            _context.Orders.Add(order);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("SaveChanges failed: " + ex.Message);
                if (ex.InnerException != null) Console.WriteLine(ex.InnerException.Message);
                throw;
            }
            HttpContext.Session.Remove("cart");
           
            return RedirectToPage(new { cleared = true });
        }

       

        
    }
}
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.ML;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using MLAPI.DataModels;
using MLAPI.Models;
using MLAPI.Services;

namespace MLAPI
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = @"_myAllowSpecificOrigins";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<PropertiesDatabaseSettings>(
                Configuration.GetSection(nameof(PropertiesDatabaseSettings)));

            services.AddSingleton<IPropertiesDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<PropertiesDatabaseSettings>>().Value);

            services.AddScoped<IPropertyService, PropertyService>();
            services.AddSingleton<PropertyService>();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "MLAPI", Version = "v1" });
            });
            services.AddPredictionEnginePool<PropertyData, PropertyPrediction>()
                        .FromFile(modelName: "PropertyPriceModel", filePath: "MLModels/price_prediction_model.zip", watchForChanges: true);
            services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins, builder =>
                {
                    builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
                });
            });
            services.AddMediatR(typeof(Startup).Assembly);

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MLAPI v1"));
            }

            app.UseCors(MyAllowSpecificOrigins);

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

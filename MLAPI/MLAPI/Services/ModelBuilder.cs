using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.ML;
using Microsoft.ML.Data;
using MLAPI.DataModels;
using System.Threading.Tasks;
using MLAPI.Models;
using MongoDB.Driver;
using Microsoft.ML.Trainers.LightGbm;

namespace MLAPI.Services
{
    public class ModelBuilder : IModelBuilder
    {
        private static string MODEL_FILE = Path.GetFullPath("MLModels\\price_prediction_model.zip");

        // Create MLContext to be shared across the model creation workflow objects 
        // Set a random seed for repeatable/deterministic results across multiple trainings.
        private static MLContext mlContext = new MLContext(seed: 1);
        private readonly IPropertyService propertyService;

        public ModelBuilder(IPropertyService propertyService)
        {
            this.propertyService = propertyService;
        }

        public async Task<string> CreateModel()
        {
            // Load Data
            List<Property> properties = await propertyService.Get(Builders<Property>.Filter.Where(prop => true));
            List<PropertyData> propertiesData = new List<PropertyData>();
            foreach(var p in properties)
            {
                propertiesData.Add(Property.Cast(p));
            }
            IDataView trainingDataView = mlContext.Data.LoadFromEnumerable(propertiesData);

            // Build training pipeline
            IEstimator<ITransformer> trainingPipeline = BuildTrainingPipeline(mlContext);

            // Train Model
            ITransformer mlModel = TrainModel(mlContext, trainingDataView, trainingPipeline);

            // Evaluate quality of Model
            string result = Evaluate(mlContext, trainingDataView, trainingPipeline);

            // Save model
            SaveModel(mlContext, mlModel, MODEL_FILE, trainingDataView.Schema);

            return result;
        }

        public IEstimator<ITransformer> BuildTrainingPipeline(MLContext mlContext)
        {
            // Data process configuration with pipeline data transformations 

            var dataProcessPipeline = mlContext.Transforms.Categorical.OneHotHashEncoding(new[] { new InputOutputColumnPair("rooms", "rooms"), new InputOutputColumnPair("bathrooms", "bathrooms"), new InputOutputColumnPair("kitchens", "kitchens") })
                                       .Append(mlContext.Transforms.Text.FeaturizeText("zone_tf", "zone"))
                                       .Append(mlContext.Transforms.Concatenate("Features", new[] { "rooms", "bathrooms", "kitchens", "zone_tf", "area", "floor", "year" }));
            // Set the training algorithm 
            var trainer = mlContext.Regression.Trainers.LightGbm(new LightGbmRegressionTrainer.Options() { NumberOfIterations = 200, LearningRate = 0.04814507f, NumberOfLeaves = 37, MinimumExampleCountPerLeaf = 1, UseCategoricalSplit = true, HandleMissingValue = true, UseZeroAsMissingValue = false, MinimumExampleCountPerGroup = 10, MaximumCategoricalSplitPointCount = 32, CategoricalSmoothing = 10, L2CategoricalRegularization = 1, Booster = new GradientBooster.Options() { L2Regularization = 0, L1Regularization = 0 }, LabelColumnName = @"price", FeatureColumnName = "Features" });

            var trainingPipeline = dataProcessPipeline.Append(trainer);

            return trainingPipeline;
        }

        public ITransformer TrainModel(MLContext mlContext, IDataView trainingDataView, IEstimator<ITransformer> trainingPipeline)
        {

            ITransformer model = trainingPipeline.Fit(trainingDataView);

            return model;
        }

        private string Evaluate(MLContext mlContext, IDataView trainingDataView, IEstimator<ITransformer> trainingPipeline)
        {
            // Cross-Validate with single dataset (since we don't have two datasets, one for training and for evaluate)
            // in order to evaluate and get the model's accuracy metrics
            var crossValidationResults = mlContext.Regression.CrossValidate(trainingDataView, trainingPipeline, numberOfFolds: 5, labelColumnName: "price");
            return RegressionFoldsAverageMetrics(crossValidationResults);
        }

        private void SaveModel(MLContext mlContext, ITransformer mlModel, string modelRelativePath, DataViewSchema modelInputSchema)
        {
            // Save/persist the trained model to a .ZIP file
            mlContext.Model.Save(mlModel, modelInputSchema, GetAbsolutePath(modelRelativePath));
        }

        public string GetAbsolutePath(string relativePath)
        {
            FileInfo _dataRoot = new FileInfo(typeof(Program).Assembly.Location);
            string assemblyFolderPath = _dataRoot.Directory.FullName;

            string fullPath = Path.Combine(assemblyFolderPath, relativePath);

            return fullPath;
        }

        public string RegressionFoldsAverageMetrics(IEnumerable<TrainCatalogBase.CrossValidationResult<RegressionMetrics>> crossValidationResults)
        {
            var L1 = crossValidationResults.Select(r => r.Metrics.MeanAbsoluteError);
            var L2 = crossValidationResults.Select(r => r.Metrics.MeanSquaredError);
            var RMS = crossValidationResults.Select(r => r.Metrics.RootMeanSquaredError);
            var lossFunction = crossValidationResults.Select(r => r.Metrics.LossFunction);
            var R2 = crossValidationResults.Select(r => r.Metrics.RSquared);
            string result = "";
            result += $"*************************************************************************************************************\n"
                + $"*       Metrics for Regression model      \n"
                + $"*------------------------------------------------------------------------------------------------------------\n"
                + $"*       Average L1 Loss:       {L1.Average():0.###} \n"
                + $"*       Average L2 Loss:       {L2.Average():0.###}  \n"
                + $"*       Average RMS:           {RMS.Average():0.###}  \n"
                + $"*       Average Loss Function: {lossFunction.Average():0.###}  \n"
                + $"*       Average R-squared:     {R2.Average():0.###}  \n"
                + $"*************************************************************************************************************\n";
            return result;
        }
    }
}

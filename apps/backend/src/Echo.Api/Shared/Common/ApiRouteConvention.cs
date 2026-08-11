using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace Echo.Api.Shared.Common
{
    public class ApiRouteConvention : IControllerModelConvention
    {
        private readonly AttributeRouteModel _apiPrefixProcessor;

        public ApiRouteConvention()
        {
            _apiPrefixProcessor = new AttributeRouteModel(new RouteAttribute("api"));
        }

        public void Apply(ControllerModel controller)
        {
            if (typeof(ApiControllerBase).IsAssignableFrom(controller.ControllerType))
            {
                foreach (var selector in controller.Selectors)
                {
                    if (selector.AttributeRouteModel != null)
                    {
                        selector.AttributeRouteModel = AttributeRouteModel.CombineAttributeRouteModel(
                           _apiPrefixProcessor,
                           selector.AttributeRouteModel);
                    }
                    else
                    {
                        selector.AttributeRouteModel = AttributeRouteModel.CombineAttributeRouteModel(
                           _apiPrefixProcessor,
                           new AttributeRouteModel(new RouteAttribute("[controller]")));
                    }
                }
            }
        }
    }
}
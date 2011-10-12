using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace DislikeButtonPlugin.Server
{
    public class Utility
    {
        public static string FacebookAppId = ConfigurationManager.AppSettings["FacebookAppId"];
        public static string FacebookSecretKey = ConfigurationManager.AppSettings["FacebookSecretKey"];
        public static string FacebookRedirectUrl = ConfigurationManager.AppSettings["FacebookRedirectUrl"];
    }
}
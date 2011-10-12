using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace DislikeButtonPlugin.Server
{
    /// <summary>
    /// Summary description for GraphConnection
    /// </summary>
    public class GraphConnection : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            var accessToken = context.Request.Params["accessToken"];
            var appNamespace = context.Request.Params["appNamespace"];
            var action = context.Request.Params["action"];
            var graphObjectType = context.Request.Params["graphObjectType"];
            var graphObject = context.Request.Params["graphObject"];

            var postData = string.Format("access_token={0}&{1}={2}", accessToken, graphObjectType, graphObject);

            var url = string.Format("https://graph.facebook.com/me/{0}:{1}", appNamespace, action);
            var request = WebRequest.Create(url);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            var byteArray = Encoding.UTF8.GetBytes(postData);
            request.ContentLength = byteArray.Length;
            var dataStream = request.GetRequestStream();

            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();

            try
            {
                using (var response = request.GetResponse())
                {
                    dataStream = response.GetResponseStream();
                    using (var reader = new StreamReader(dataStream))
                    {
                        context.Response.Write(reader.ReadToEnd());
                        reader.Close();
                    }
                    dataStream.Close();
                    dataStream.Dispose();
                    response.Close();
                }
            }
            catch (WebException ex)
            {
                dataStream = ex.Response.GetResponseStream();
                using (var reader = new StreamReader(dataStream))
                {
                    var r = reader.ReadToEnd();
                    context.Response.Write(r);
                    reader.Close();
                }
                dataStream.Close();
                dataStream.Dispose();
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
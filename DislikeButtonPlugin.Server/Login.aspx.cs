using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.Text;

namespace DislikeButtonPlugin.Server
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            var code = Request.QueryString["code"];

            var url =
                string.Format(
                    "https://graph.facebook.com/oauth/access_token?client_id={0}&redirect_uri={1}&client_secret={2}&code={3}",
                    Utility.FacebookAppId, Utility.FacebookRedirectUrl, Utility.FacebookSecretKey, code);

            var request = WebRequest.Create(url);
            request.Method = "GET";
            using (var response = request.GetResponse())
            using (var stream = new StreamReader(response.GetResponseStream()))
            {
                var content = stream.ReadToEnd();

                var parameters = content.Split('&');
                var token = new StringBuilder();
                token.Append("{");
                for (var i = 0; i < parameters.Length; i++ )
                {
                    var parameter = parameters[i].Split('=');
                    token.AppendFormat(" \"{0}\" : \"{1}\" ", parameter[0], parameter[1] ?? string.Empty);
                    if(i + 1 < parameters.Length)
                        token.Append(",");
                }
                token.Append("}");

                Response.Write(token.ToString());

                stream.Close();
                response.Close();
            }
        }
    }
}
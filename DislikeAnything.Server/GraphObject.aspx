<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="GraphObject.aspx.cs" Inherits="DislikeButtonPlugin.Server.GraphObject" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server" prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">
    <meta property="fb:app_id" content="241081449272853" />
    <meta property="og:type" content="<%=Request.QueryString["type"] ?? "" %>" />
    <meta property="og:url" content="<%# Request.Url.ToString() %>" />
    <meta property="og:title" content="<%=Request.QueryString["title"] ?? "" %>" />
    <meta property="og:description" content="<%=Request.QueryString["description"] ?? ""  %>" />
    <meta property="og:image" content="<%=Request.QueryString["image"] ?? "http://ogp.me/logo.png" %>" />
    <title><%=Request.QueryString["title"] ?? "" %></title>
</head>
<body>
    <script type="text/javascript">
        location.href = '<%=Request.QueryString["url"] ?? "" %>';
    </script>
</body>
</html>

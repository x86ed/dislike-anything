<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<script runat="server">

</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script type="text/javascript">
        function passValueToParent(value) {
            console.log(parent);
            console.log(window.parent);
            newLocation = parent.location.href + "#" + value;
            alert(newLocation);
            parent.location.href = newLocation;
        }
    </script>
</head>
<body>
    <form id="HtmlForm" runat="server">
    <div>
        Iframe
        <a href="javascript:passValueToParent('hello world')">click me</a>
    </div>
    </form>
</body>
</html>

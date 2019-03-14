---
layout: page-fullwidth
subheadline:  "DiscordBOT"
title:  "使用vb製作一個屬於自己的DsicordBOT (一)"
teaser: "製作第一個DiscordBOT! "
image:  
    thumb: "discord.png" 
categories:
    - vb
tags:
    - VB.NETDiscrd Discord.NET DiscordBOT Dsicord機器人
---

<!--more-->
<div class="row">
<div class="medium-4 medium-push-8 columns" markdown="1">
<div class="panel radius" markdown="1">
**Table of Contents**
{: #toc }
*  TOC
{:toc}
</div>
</div><!-- /.medium-4.columns -->
<div class="medium-8 medium-pull-4 columns" markdown="1">


## 1.HelloWorld

### #創建一個Discord應用程式 

1.前往 [Discord Developer Portal - MY APPLICATIONS](https://discordapp.com/developers/applications) <br>
![img][MY-APPLICATIONS]
2.點選 `New Applications` 並且取一個名子 <br>

![img][CREATE-AN-APPLICATION]

之後進入你的應用設定頁面，左側找到`Bots` 選項按下`Add Bot`<br>

![img][BUILD-A-BOT]

3.前往`OAuth2`介面

在`SCOPES` 欄位勾選BOT，下方就會生成邀請網址。<br>
在`BOT PERMISSIONS`這裡可以設定BOT預設要求權限

![img][OAuth2_URL]

然後就可以用邀請用連結邀請到你的伺服器了!

![img][Bot]


### #安裝Disocrd.NET 
<br>
首先建立一個VB 的WPF專案 然後點選 <br> 
`工具 -> NuGet套件套件管理員 -> 管理方案的 NuGet 套件`

在瀏覽分頁中搜尋 Discord.NET 並且安裝到現在的專案，
途中會跳出`"接受授權"`點確定就對了

<br>

### #建立連接 & 啟動BOT

```vb
Public Class Form1
    Dim discord As DiscordSocketClient
    Private Sub Form1_Load(sender As Object, e As EventArgs) Handles MyBase.Load
    
        discord = New DiscordSocketClient(New DiscordSocketConfig With {
                                .MessageCacheSize = 500 '設定最大訊息快取
    })

    discord.LoginAsync(TokenType.Bot, "你的Token這裡")'登入BOT
    discord.StartAsync()

    End Sub
End Class
```
這樣啟動表單 查看你的Discord 看看BOT有沒有上限瞜!

<br>

#### #聊天室訊息事件
再來要接收聊天室訊息，需要先有一個事件來接收(`MessageReceived`)。
在Form1_Load 加上 事件
```vb
AddHandler discord.MessageReceived, AddressOf msgReceived
```
並且新增一段Func
```vb
Private Function msgReceived(msg As SocketMessage) As Task
    MsgBox(msg.Author.Username & vbCrLf & msg.Content)
End Function
```
執行效果如下

![img][TestMessage]

<br>

#### #指令

```vb
Dim prefix As String = "!"
Private Async Function msgReceived(msg As SocketMessage) As Task

    If msg.Source = MessageSource.Bot Then Exit Function '如果訊息來源來自其他BOT 那就跳過

    Dim User As SocketUser = msg.Author '將msg.Author轉為SocketUser

    If msg.Content.StartsWith(prefix) Then '如果開頭為 設定的prefix (這裡目前為 ! )

        '將用戶輸入內容擷取 prefix 到 空格 的文字
        Dim cmd As String = msg.Content.Split(Convert.ToChar(prefix))(1).Split(Convert.ToChar(" "))(0)

        Select Case cmd.ToLower '將用戶輸入的指令轉為小寫 (如果要區分大小寫 就把 .ToLower 拿掉)

            Case "hi" '命令為 [prefix]hi
                Await msg.Channel.SendMessageAsync("HI " & User.Mention & " !")
                '傳送訊息

            Case "bye" '命令為 [prefix]bye
                Await msg.Channel.SendMessageAsync("Goodbye " & User.Mention & " !")
                '傳送訊息

        End Select

    End If

End Function
```
執行效果如下

![img][commandTest]

<br>

#### #紀錄聊天訊息
由於`Private Async Function msgReceived(msg As SocketMessage) As Task` 是一個**跨執行續的Func**，這裡如果要用到 ListView 或是 DataGridViewr <br>(應該是所有**跨執行續更新UI**) 都需要使用**委派(Delegate)**。

這裡以 Listview 示範，資料行如下圖有四個。

![img][Form1listview]

先建立一個拿來更新 Listview 的方法，如同下面的 UpdateListview，然後再建立一個有相同 signature 的委派，下面叫 MyListViewCallBack 。

```vb
    Private Delegate Sub MyListViewCallBack(ByVal item As ListViewItem)
    Private Sub UpdateListview(ByVal item As ListViewItem)
        If Me.InvokeRequired() Then
            Dim cb As New MyListViewCallBack(AddressOf UpdateListview)
            Me.Invoke(cb, item)
        Else
            ListView1.Items.Add(item)
        End If
    End Sub
```

這時候就可以在`Private Async Function msgReceived(msg As SocketMessage) As Task`
裡面，宣告一個 `Dim item as new ListViewItem`
設定完裡面內如後，再用 `UpdateListview(item)` 即可添加到ListView 裡面了。

**這部分的完整內容**
```vb
    Private Async Function msgReceived(msg As SocketMessage) As Task

        If msg.Source = MessageSource.Bot Then Exit Function '如果訊息來源來自其他BOT 那就跳過

        Dim User As SocketUser = msg.Author '將msg.Author轉為SocketUser

        If msg.Content.StartsWith(prefix) Then '如果開頭為 設定的prefix (這裡目前為 ! )

            '將用戶輸入內容擷取 prefix 到 空格 的文字
            Dim cmd As String = msg.Content.Split(Convert.ToChar(prefix))(1).Split(Convert.ToChar(" "))(0)

            Select Case cmd.ToLower '將用戶輸入的指令轉為小寫 (如果要區分大小寫 就把 .ToLower 拿掉)

                Case "hi" '命令為 [prefix]hi
                    Await msg.Channel.SendMessageAsync("HI " & User.Mention & " !")
                '傳送訊息

                Case "bye" '命令為 [prefix]bye
                    Await msg.Channel.SendMessageAsync("Goodbye " & User.Mention & " !")
                    '傳送訊息

            End Select

        End If

        Dim item As New ListViewItem
        item.Text = Date.Now
        item.SubItems.Add("訊息")
        item.SubItems.Add(User.Username)
        item.SubItems.Add(msg.Content)
        UpdateListview(item)

    End Function

    Private Delegate Sub MyListViewCallBack(ByVal item As ListViewItem)
    Private Sub UpdateListview(ByVal item As ListViewItem)
        If Me.InvokeRequired() Then
            Dim cb As New MyListViewCallBack(AddressOf UpdateListview)
            Me.Invoke(cb, item)
        Else
            ListView1.Items.Add(item)
        End If
    End Sub
```

![img][FinalResults]




#### 全部程式碼:
```vb
Imports System.ComponentModel
Imports Discord
Imports Discord.WebSocket

Public Class Form1
    Dim discord As DiscordSocketClient
    Dim prefix As String = "!"
    Dim isStart As Boolean = False

    Private Sub Form1_Load(sender As Object, e As EventArgs) Handles MyBase.Load

        discord = New DiscordSocketClient(New DiscordSocketConfig With {
                                .MessageCacheSize = 500
    })
        AddHandler discord.LoggedOut, AddressOf LoggedOut
        AddHandler discord.LoggedIn, AddressOf Loggedin
        AddHandler discord.MessageReceived, AddressOf msgReceived

    End Sub

    Private Function Loggedin() As Task

        Label1.Invoke(Sub(x) Label1.Text = x, "線上Online") '匿名委派
        Label1.Invoke(Sub(x) Label1.BackColor = x, Drawing.Color.MediumSpringGreen)
        '由於有 Imports Discord ，Color 會被 Discord.Color 給占走 要用原本的color 要在前面加上Drawing

        Dim item As New ListViewItem
        item.Text = Date.Now
        item.ForeColor = Drawing.Color.Green
        item.SubItems.Add("資訊")
        item.SubItems.Add("系統")
        item.SubItems.Add("以成功登入")

        UpdateListview(item)

    End Function

    Private Function LoggedOut() As Task

        Label1.Invoke(Sub(x) Label1.Text = x, "離線Offline") '匿名委派
        Label1.Invoke(Sub(x) Label1.BackColor = x, Drawing.Color.Silver)


        Dim item As New ListViewItem
        item.Text = Date.Now
        item.ForeColor = Drawing.Color.Green
        item.SubItems.Add("資訊")
        item.SubItems.Add("系統")
        item.SubItems.Add("以成功登出")

        UpdateListview(item)

    End Function

    Private Async Function msgReceived(msg As SocketMessage) As Task

        If msg.Source = MessageSource.Bot Then Exit Function '如果訊息來源來自其他BOT 那就跳過

        Dim User As SocketUser = msg.Author '將msg.Author轉為SocketUser

        If msg.Content.StartsWith(prefix) Then '如果開頭為 設定的prefix (這裡目前為 ! )

            '將用戶輸入內容擷取 prefix 到 空格 的文字
            Dim cmd As String = msg.Content.Split(Convert.ToChar(prefix))(1).Split(Convert.ToChar(" "))(0)

            Select Case cmd.ToLower '將用戶輸入的指令轉為小寫 (如果要區分大小寫 就把 .ToLower 拿掉)

                Case "hi" '命令為 [prefix]hi
                    Await msg.Channel.SendMessageAsync("HI " & User.Mention & " !")
                '傳送訊息

                Case "bye" '命令為 [prefix]bye
                    Await msg.Channel.SendMessageAsync("Goodbye " & User.Mention & " !")
                    '傳送訊息

            End Select

        End If

        Dim item As New ListViewItem
        With item
            .Text = Date.Now
            .SubItems.Add("訊息")
            .SubItems.Add(User.Username)
            .SubItems.Add(msg.Content)
        End With
        UpdateListview(item)

    End Function

    Private Delegate Sub MyListViewCallBack(ByVal item As ListViewItem)
    Private Sub UpdateListview(ByVal item As ListViewItem)
        If Me.InvokeRequired() Then
            Dim cb As New MyListViewCallBack(AddressOf UpdateListview)
            Me.Invoke(cb, item)
        Else
            ListView1.Items.Add(item)
        End If
    End Sub

    Private Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click

        isStart = Not isStart

        If isStart Then

            Try

                discord.LoginAsync(TokenType.Bot, "NTUzNDExNjg4MjQyODcyMzMw.D2OQCA.7l6z4aY_-0FCfZs3IISq6MMod8c")
                discord.StartAsync()
                Button1.Text = "停止"
            Catch ex As Exception

                MsgBox(ex.Message)
                isStart = False
                Button1.Text = "啟動"
                Exit Sub

            End Try

        Else
            Button1.Text = "啟動"
            discord.LogoutAsync()
            discord.StopAsync()


        End If

    End Sub

    Private Sub Form1_Closing(sender As Object, e As CancelEventArgs) Handles Me.Closing

        If discord.LoginState = LoginState.LoggedIn Then discord.LogoutAsync()
        discord.StopAsync()

    End Sub
End Class

```




















[MY-APPLICATIONS]:https://InterfaceGUI.github.io/images/MY-APPLICATIONS.png

[CREATE-AN-APPLICATION]:https://InterfaceGUI.github.io/images/CREATE-AN-APPLICATION.png

[BUILD-A-BOT]:https://InterfaceGUI.github.io/images/BUILD-A-BOT.png

[OAuth2_URL]:https://InterfaceGUI.github.io/images/OAuth2_URL.png

[Bot]:https://InterfaceGUI.github.io/images/Bot.png

[TestMessage]:https://InterfaceGUI.github.io/images/TestMessage.png

[commandTest]:https://InterfaceGUI.github.io/images/commandTest.png

[Form1listview]:https://InterfaceGUI.github.io/images/Form1-listview.png

[FinalResults]:https://InterfaceGUI.github.io/images/FinalResults.png

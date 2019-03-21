---
layout: page-fullwidth
subheadline:  "DiscordBOT"
title:  "使用vb製作一個屬於自己的DsicordBOT (二)"
teaser: "訊息篇 本篇講解Embed、SendFile、DirectMessage 用法。 製作一個 Discord BOT !  "
image:  
    thumb: "discord.png" 
categories:
    - vb
tags:
    - VB.NETDiscrd Discord.NET DiscordBOT Dsicord機器人
---

<!--more-->
<div class="row">
<div class="medium-3 medium-push-10 columns" markdown="1">
<div class="panel radius" markdown="1">
**Table of Contents**
{: #toc }
*  TOC
{:toc}
</div>
</div><!-- /.medium-4.columns -->
<div class="medium-9 medium-pull-3 columns" markdown="1">

## 2.傳送訊息!

### #SendMessageAsync()

`SendMessageAsync()` 有以下幾個參數:
* `text as String = nothing`<br>
    就....要傳送的文字內容

* `isTTS as boolean = false`<br>
    是否要用文字轉語音功能

* `embed as Embed = nothing`<br>
    嵌入介面(下方會講到)

* `[options as RequestOptions = nothing]`<br>
    這個Emmm 目前用不到

    <br>
    
***
### #SendFile 傳送檔案

傳送檔案需要使用到`SendFileAsync()`
參數:
* `filepath as string`
<br>
    這個就.. 如他名子所示"檔案路徑"

* `[text as string = nothing]`
<br>
    這個是訊息的文字內容

* `[isTTS as boolean = false]`
<br>
    TTS 文字轉語音 (要不要念出你的內容)

* `[embed as Embed = nothing]`
<br>
    嵌入訊息等等會講到

* `[options as RequestOptions = nothing]`
<br>
    這個Emmm 目前用不到

如果是採用指令的方式 (上一張講到的指令)
，那大可可以用:
```vb
Await msg.Channel.SendFileAsync()
```
這方法可以取得原訊息的頻道 並且發送到那個頻道

以上一篇程式繼續當範例:
```vb
Private Async Function msgReceived(msg As SocketMessage) As Task

        If msg.Source = MessageSource.Bot Then Exit Function '如果訊息來源來自其他BOT 那就跳過

        Dim User As SocketGuildUser = msg.Author '將msg.Author轉為SocketUser

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



                    '傳送檔案範例在這!!
                Case "Image"  '命令為 [prefix]Image

                    Dim Imgpath As String = IO.Path.Combine(My.Application.Info.DirectoryPath, "imgs")  '取的專案中的"imgs"資料夾路徑
                    Dim rnd As New Random '宣告亂數

                    '在imgs裡面中的所有檔案挑選隨機一個出來
                    Dim Rpath As String = My.Computer.FileSystem.GetFiles(Imgpath)(rnd.Next(My.Computer.FileSystem.GetFiles(Imgpath).Count))

                    Await msg.Channel.SendFileAsync(Rpath) '傳送剛剛挑出來的檔案

                '到這裡



            End Select
        End If

        Dim item As New ListViewItem '宣告item是一個新的Listviewitem
        With item
            .Text = Date.Now
            .SubItems.Add("訊息")
            .SubItems.Add(User.Username)
            .SubItems.Add(msg.Content)
        End With
        UpdateListview(item)

    End Function
```

如果要指定伺服器、頻道那就要採用這個方法:

```vb
discord.GetGuild(id as Ulong).GetTextChannel(id as Ulong).SendFileAsync()
```
記得在 **GetGuild()** 裡面填入伺服器ID 
，以及 **GetTextChannel()** 填入頻道ID，兩者都是要 **Ulong** (不帶正負號的整數)

**Note:** <br>
&emsp;複製ID方法 就是在DIscord設定頁面中的"外觀"選項卡 裡面的**"啟用開發人員"** 

範例:
```vb
Private Async Sub B_UploadFile_Click(sender As Object, e As EventArgs) Handles B_UploadFile.Click
    Dim dialog As New OpenFileDialog '用OpenFile 對話框
    dialog.ShowDialog() '顯示對話框
    If dialog.FileName <> "" Then '如果檔案路徑不是"" 
        Await discord.GetGuild(504570702121271296).GetTextChannel(504570702121271298).SendFileAsync(dialog.FileName, "")'傳送檔案
            
    End If
End Sub
```

<br>

***

### #DirectMessage 私訊

首先需要取得用戶，
`SocketUser` 以及 `SocketGuildUser`。
兩者都可以發送私訊。

SendMessageAsync()


可以透過透過訊息來去取得使用者(`SocketUser`)
<br>用法:
```vb 
msg.Author.SendMessageAsync("Hello")
```

或是取得他人的ID之後使用
```vb
'1234 為伺服器ID ， 5678 為用戶ID
discord.GetGuild(1234).GetUser(5678).SendMessageAsync("Hello!")
```

當然，私訊也可以傳送檔案!

<br>

***

### #Embed 嵌入式訊息

傳送Embed 需要先宣告一個 `EmbedBuilder`

利用 EmbedBuilder 建立一個 Embed

Embed 有以下屬性

* `Author` <br>
    Author為左上角的 帶圖示、名稱及連結的使用者...圖示。<br>
    要建立一個Author，必須使用 `EmbedAuthorBuilder`。<br>
    子屬性有:<br>
    * IconUrl<br>
        頭像名稱，如附圖中 [A1] 的頭像顯示。

    * Name<br>
        名稱，如附圖中 [A2] 所顯示的名稱

    * Url<br>
        連結，名稱的超連結網址
    
    範例:    
    ```vb
    embed.Author = New EmbedAuthorBuilder With {
                        .IconUrl = "https://avatars0.githubusercontent.com/u/15845368?s=460&v=4",
                        .Name = "TechWolf",
                        .Url = "https://interfacegui.github.io/info/"
                        }
    ```
<br>

* `Color`<br>
    嵌入介面左側的顏色。 **注意: 必須使用Discord.Color命名空間的顏色喔!**<br>
    用法:
    ```vb
    Imports Discord'記得要在最上面 import 喔!

    embed.Color = Color.Blue
    ```

<br>

* `Description`<br>
    "內文" 這個為要顯示的文字內容<br>
    用法:
    ```vb
    embed.Description = "這個就是內文了"
    ```

<br>

* `Fields`<br>
    "字段" 用來顯示 痾... 如下圖 F1 框框中的效果。<br>
    要建立一個Fields，必須使用 `List(Of EmbedFieldBuilder)`。<br>
    子屬性有:<br>
    * IsInline<br>
    這個為布林值，功能是不換行，與下一個併排在一起。

    * Name<br>
    字段標題

    * Value<br>
    字段內容

    用法:
    ```vb
    embed.Fields = New List(Of EmbedFieldBuilder) From {
                        New EmbedFieldBuilder With {
                            .IsInline = True, .Name = "標題", .Value = "內文1"
                            },
                        New EmbedFieldBuilder With {
                            .IsInline = True, .Name = "標題2", .Value = "內文2"
                            },
                        New EmbedFieldBuilder With {
                            .IsInline = True, .Name = "標題3", .Value = "內文3"
                            },
                        New EmbedFieldBuilder With {
                            .IsInline = false, .Name = "標題4", .Value = "內文4"
                            }}
    ```
* `Footer`<br>
    "頁角" 內容會顯示在嵌入訊息的左下角。<br>
    要建立一個Fields，必須使用 `EmbedFooterBuilder`。<br>
    子屬性有:<br>
    * IconUrl<br>
    小型頭像或是圖像的網址

    * Text<br>
    要顯示的訊息

    用法:
    ```vb
    embed.Footer = New EmbedFooterBuilder With {.IconUrl = "https://avatars0.githubusercontent.com/u/15845368?s=460&v=4", .Text = "The bot is made by TechWolf"}
    ```


* `ImageUrl`<br>
    "圖片" 每一則嵌入訊息只能有一張圖片，圖片網址就是放在這裡。
* `ThumbnailUrl`<br>
    "縮圖" 每一則嵌入訊息也只能有一張縮圖，縮圖位置在於左上角。
* `Timestamp`<br>
    "時間戳" 用於顯示時間在頁角上 格式是 UTC +0
* `Title`<br>
    "標題" 顧名思義
* `Url`<br>
    "標題的超連結網址"


以上製作完Embed之後，很重要的一件事。
<br>
要發送訊息時 需要使用 embed.Build()<br>
例如:
```vb
 Await msg.Channel.SendMessageAsync("", False, embed.Build)
```


範例程式:
```vb
Dim em As New EmbedBuilder With {
    .Author = New EmbedAuthorBuilder With {
    .IconUrl = User.GetAvatarUrl,
    .Name = User.Username,
    .Url = "https://interfacegui.github.io/info/"
    },
    .Color = Color.Blue,
    .Description = "Description 文字....",
    .Fields = New List(Of EmbedFieldBuilder) From {
        New EmbedFieldBuilder With {.IsInline = True, .Name = "標題", .Value = "內文1"},
        New EmbedFieldBuilder With {.IsInline = True, .Name = "標題2", .Value = "內文2"},
        New EmbedFieldBuilder With {.IsInline = True, .Name = "標題3", .Value = "內文3"},
        New EmbedFieldBuilder With {.IsInline = False, .Name = "標題4", .Value = "內文4"}},
    .Footer = New EmbedFooterBuilder With {.IconUrl = "https://avatars0.githubusercontent.com/u/15845368?s=460&v=4", .Text = "The bot is made by TechWolf"},
    .ImageUrl = "https://interfacegui.github.io/images/discord.png",
    .ThumbnailUrl = "https://avatars0.githubusercontent.com/u/15845368?s=460&v=4",
    .Timestamp = Date.UtcNow.AddHours(8).Now,
    .Title = "標題",
    .Url = User.GetAvatarUrl
}
         
Await msg.Channel.SendMessageAsync("", False, em.Build)
```


[![Embed](https://InterfaceGUI.github.io/images/DiscordBOT_1/Embed.png)](https://InterfaceGUI.github.io/images/DiscordBOT_1/Embed.png)







<script>
    import { parseMail } from '@protontech/jsmimeparser';
    const eml = `Return-Path: <noreply@auth.gr>
Received: from hermes16.it.auth.gr (hermes16.it.auth.gr [155.207.1.233])
	by hermes18.it.auth.gr (8.14.4/8.14.4/Debian-4.1ubuntu1.1) with ESMTP id 435IAgXc119330
	(version=TLSv1/SSLv3 cipher=AES256-GCM-SHA384 bits=256 verify=NOT)
	for <neronmkp@csd.auth.gr>; Fri, 5 Apr 2024 21:10:43 +0300
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=auth.gr; s=default;
	t=1712340643; bh=h5pMfRxto/eyB+QZDyLvufwBa7z6e/4BZLHn8MWI/Ns=;
	h=Date:To:From:Reply-To:Subject:List-Id:List-Help:List-Unsubscribe:
	 From;
	b=UdQAjKaH8scwOCZbSUEZjwQFLq7s+4JGMQQNJFClggLrv51ZZxdUEGaJjGNbKHT4R
	 z9W8I607IMED10QznwHLUWC5v7P8G/ZfHf4n0lVX6/r/8rPBBMHYX1iU7BnLDy4InT
	 Rl3Roidhs1ND+qWsFHAMwwgg+7tKtNDlQo71TFUROoZpiMDVhOaz1nOCM4irGBAT1R
	 AqWCvJDbvPKUGuANvFmCQdsI12rD4U+DFYBSVRxrkZkqeIjNzTMiXmzEx+jXh8/vIc
	 oUp5IyfL8Ek/pIZddnvfwS+gGbnEFyT5px/QDZod2r+KMmyrxHBLbkuF20TDtoRRVo
	 Qn5y+1A+KBJ1Q==
Received: from learnea04.it.auth.gr (learnea04.it.auth.gr [10.8.1.51])
	by hermes16.it.auth.gr (8.14.4/8.14.4/Debian-4.1ubuntu1.1) with ESMTP id 435IAfNb033350
	(version=TLSv1/SSLv3 cipher=AES256-GCM-SHA384 bits=256 verify=NOT)
	for <neronmkp@csd.auth.gr>; Fri, 5 Apr 2024 21:10:42 +0300
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=auth.gr; s=default;
	t=1712340642; bh=h5pMfRxto/eyB+QZDyLvufwBa7z6e/4BZLHn8MWI/Ns=;
	h=Date:To:From:Reply-To:Subject:List-Id:List-Help:List-Unsubscribe:
	 From;
	b=MGfjbF92OuYXs9W87wdfw7fr8h1wdS8d5GB0eHvwJ3xcRqcuxdwyEs7zva4oSuVGB
	 9+XMehDy4ubcZw00X0A+dpBtcLc2SUnQJ7FebCFstpWFJcRskJ8m46GWT23P6Urleg
	 i6Y//bbAhPi6R6nIfFack9QbEXVUqHhgljRFhD6jprLtrZRQHMJvAmK6AsjEkzfAjL
	 5yHhyJ19NU8w008/2O37BtVmvhWYrxDpujNs4fFzgmH3agj9/ShbZeF583HrCV9ikC
	 p8FZ2MJdinV/MHucUVpe6biB3KtE1EESzAQtjC7/qCPjFM4QNxDavgszzQVna5CD/j
	 mGkpZasEcymmA==
Received: from learnea04.it.auth.gr (localhost.localdomain [127.0.0.1])
	by learnea04.it.auth.gr (8.15.2/8.15.2/Debian-10) with ESMTP id 435IAfa6084348
	for <neronmkp@csd.auth.gr>; Fri, 5 Apr 2024 21:10:41 +0300
Date: Fri, 5 Apr 2024 21:10:41 +0300
To: "=?utf-8?B?zqDOsc69zrHOs865z4nPhM+Mz4DOv8+FzrvOv8+CIM6dzq3Pgc+Jzr0gzpw=?=
 =?utf-8?B?zrnPh86xzq7Ouw==?=" <neronmkp@csd.auth.gr>
From: "=?utf-8?B?zpPOv8+Nzr3Osc+BzrfPgiDOkc69zrHPg8+EzqzPg865zr/PgiAozrzOrc+D?=
 =?utf-8?B?z4kgZWxlYXJuaW5nLmF1dGgp?=" <noreply@auth.gr>
Reply-To: "=?utf-8?B?zpzOt869IM6xz4DOsc69z4TOrs+DzrXPhM61IM+DzrUgzrHPhc+Ezq4gz4Q=?=
 =?utf-8?B?zrcgzrTOuc61z43OuM+Fzr3Pg863IM63zrvOtS7PhM6xz4fPhc60z4HOv868?=
 =?utf-8?B?zrXOr86/z4U=?=" <noreply@auth.gr>
Subject: =?utf-8?B?TklTLTA4LTA2OiDOkc+Bz4fOrc+CIM61z4DOuc+Dz4TOrs68zrfPgg==?=
 =?utf-8?B?IM60zrXOtM6/zrzOrc69z4nOvSDOus6xzrkgzrnPg8+Ezr/PjTogzrTOt867?=
 =?utf-8?B?z47Pg861zrnPgiDPgM+Bzr/PhM6vzrzOt8+DzrfPgiDOs865zrEgzrjOrQ==?=
 =?utf-8?B?zrzOsc+EzrEgz4DOsc+Bzr/Phc+Dzq/Osc+DzrfPgg==?=
Message-ID: <d8e94496933b385037bf780be733526e21bef8570f69471d7018cfc15bd7bb8a@elearning.auth.gr>
X-Priority: 3
X-Mailer: PHPMailer 6.5.3 (https://github.com/PHPMailer/PHPMailer)
List-Id: =?utf-8?B?IkZvcnVtIM6Rzr3Osc66zr/Ouc69z47Pg861z4nOvSIgPG1vb2RsZWZvcnVt?=
 =?utf-8?B?Mjc0NDdAZWxlYXJuaW5nLmF1dGguZ3I+?=
List-Help: https://elearning.auth.gr/mod/forum/view.php?f=27447
X-Course-Id: 18353
X-Course-Name: =?utf-8?B?zpHPgc+Hzq3PgiDOtc+AzrnPg8+Ezq7OvM63z4IgzrTOtc60zr/OvM6t?=
 =?utf-8?B?zr3Pic69IM66zrHOuSDOuc+Dz4TOv8+N?=
Precedence: Bulk
X-Auto-Response-Suppress: All
Auto-Submitted: auto-generated
List-Unsubscribe: <>
Thread-Topic: =?utf-8?B?TklTLTA4LTA2OiDOkc+Bz4fOrc+CIM61z4DOuc+Dz4TOrs68zrfPgg==?=
 =?utf-8?B?IM60zrXOtM6/zrzOrc69z4nOvSDOus6xzrkgzrnPg8+Ezr/PjTogzrTOt867?=
 =?utf-8?B?z47Pg861zrnPgiDPgM+Bzr/PhM6vzrzOt8+DzrfPgiDOs865zrEgzrjOrQ==?=
 =?utf-8?B?zrzOsc+EzrEgz4DOsc+Bzr/Phc+Dzq/Osc+DzrfPgg==?=
Thread-Index: d8e94496933b385037bf780be733
MIME-Version: 1.0
Content-Type: multipart/alternative;
 boundary="b1_dlcFuXTv22m9aUXiaj1mCOfVaXy03d9qKOsAq0eXVQ"
X-Virus-Scanned: clamav-milter 0.103.9 at hermes16
X-Virus-Status: Clean

This is a multi-part message in MIME format.

--b1_dlcFuXTv22m9aUXiaj1mCOfVaXy03d9qKOsAq0eXVQ
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: quoted-printable


NIS-08-06 -> =CE=A6=CF=8C=CF=81=CE=BF=CF=85=CE=BC -> Forum =CE=91=CE=BD=
=CE=B1=CE=BA=CE=BF=CE=B9=CE=BD=CF=8E=CF=83=CE=B5=CF=89=CE=BD -> =CE=91=
=CF=81=CF=87=CE=AD=CF=82
=CE=B5=CF=80=CE=B9=CF=83=CF=84=CE=AE=CE=BC=CE=B7=CF=82 =CE=B4=CE=B5=CE=
=B4=CE=BF=CE=BC=CE=AD=CE=BD=CF=89=CE=BD =CE=BA=CE=B1=CE=B9 =CE=B9=CF=83=
=CF=84=CE=BF=CF=8D: =CE=B4=CE=B7=CE=BB=CF=8E=CF=83=CE=B5=CE=B9=CF=82
=CF=80=CF=81=CE=BF=CF=84=CE=AF=CE=BC=CE=B7=CF=83=CE=B7=CF=82 =CE=B3=CE=
=B9=CE=B1 =CE=B8=CE=AD=CE=BC=CE=B1=CF=84=CE=B1 =CF=80=CE=B1=CF=81=CE=BF=
=CF=85=CF=83=CE=AF=CE=B1=CF=83=CE=B7=CF=82
https://elearning.auth.gr/mod/forum/discuss.php?d=3D209985#p283374
=CE=91=CF=81=CF=87=CE=AD=CF=82 =CE=B5=CF=80=CE=B9=CF=83=CF=84=CE=AE=CE=
=BC=CE=B7=CF=82 =CE=B4=CE=B5=CE=B4=CE=BF=CE=BC=CE=AD=CE=BD=CF=89=CE=BD =
=CE=BA=CE=B1=CE=B9 =CE=B9=CF=83=CF=84=CE=BF=CF=8D:
=CE=B4=CE=B7=CE=BB=CF=8E=CF=83=CE=B5=CE=B9=CF=82 =CF=80=CF=81=CE=BF=CF=
=84=CE=AF=CE=BC=CE=B7=CF=83=CE=B7=CF=82 =CE=B3=CE=B9=CE=B1 =CE=B8=CE=AD=
=CE=BC=CE=B1=CF=84=CE=B1
=CF=80=CE=B1=CF=81=CE=BF=CF=85=CF=83=CE=AF=CE=B1=CF=83=CE=B7=CF=82
=CE=B1=CF=80=CF=8C =CE=93=CE=BF=CF=8D=CE=BD=CE=B1=CF=81=CE=B7=CF=82 =CE=
=91=CE=BD=CE=B1=CF=83=CF=84=CE=AC=CF=83=CE=B9=CE=BF=CF=82 - Friday, 5 April=
 2024, 8:38
PM
---------------------------------------------------------------------
=CE=9A=CE=B1=CE=BB=CE=B7=CF=83=CF=80=CE=AD=CF=81=CE=B1 =CE=BA=CE=B1=CE=
=B9 =CF=80=CE=AC=CE=BB=CE=B9,

=CF=8C=CF=80=CF=89=CF=82 =CF=83=CF=85=CE=B6=CE=B7=CF=84=CE=AE=CE=B8=CE=
=B7=CE=BA=CE=B5 =CF=83=CF=84=CE=B7=CE=BD =CF=83=CE=B7=CE=BC=CE=B5=CF=81=
=CE=B9=CE=BD=CE=AE =CE=B4=CE=B9=CE=AC=CE=BB=CE=B5=CE=BE=CE=B7,
=CF=83=CF=84=CE=BF elearning =CF=85=CF=80=CE=AC=CF=81=CF=87=CE=B5=CE=B9 =
=CF=84=CF=8C=CF=83=CE=BF =CE=B7 =CE=B2=CE=B1=CF=83=CE=B9=CE=BA=CE=AE =CF=
=80=CE=B5=CF=81=CE=B9=CE=B3=CF=81=CE=B1=CF=86=CE=AE
=CF=84=CF=89=CE=BD =CE=B8=CE=B5=CE=BC=CE=AC=CF=84=CF=89=CE=BD =CE=B3=CE=
=B9=CE=B1 =CF=80=CE=B1=CF=81=CE=BF=CF=85=CF=83=CE=AF=CE=B1=CF=83=CE=B7 =
=CF=8C=CF=83=CE=BF =CE=BA=CE=B1=CE=B9 =CE=BF
=CF=83=CF=8D=CE=BD=CE=B4=CE=B5=CF=83=CE=BC=CE=BF=CF=82 =CE=B3=CE=B9=CE=
=B1 =CF=84=CE=B7 =CF=86=CF=8C=CF=81=CE=BC=CE=B1 =CE=B4=CE=AE=CE=BB=CF=89=
=CF=83=CE=B7=CF=82
=CF=80=CF=81=CE=BF=CF=84=CE=B9=CE=BC=CE=AE=CF=83=CE=B5=CF=89=CE=BD. =CE=
=94=CE=B5=CE=BD =CE=BC=CF=80=CE=BF=CF=81=CE=B5=CE=AF =CE=BD=CE=B1 =CF=85=
=CF=80=CE=AC=CF=81=CF=87=CE=B5=CE=B9
=CF=80=CF=81=CE=BF=CF=86=CE=B1=CE=BD=CF=8E=CF=82 =CE=BA=CE=AC=CF=80=CE=
=BF=CE=B9=CE=B1 =CE=B5=CE=B3=CE=B3=CF=8D=CE=B7=CF=83=CE=B7 =CF=8C=CF=84=
=CE=B9 =CE=B8=CE=B1 =CE=BC=CF=80=CE=BF=CF=81=CE=BF=CF=8D=CE=BD
=CE=BD=CE=B1 =CE=B9=CE=BA=CE=B1=CE=BD=CE=BF=CF=80=CE=BF=CE=B9=CE=B7=CE=
=B8=CE=BF=CF=8D=CE=BD =CF=8C=CE=BB=CE=B5=CF=82 =CE=BF=CE=B9 =CF=80=CF=81=
=CE=BF=CF=84=CE=B9=CE=BC=CE=AE=CF=83=CE=B5=CE=B9=CF=82,
=CE=B1=CE=BB=CE=BB=CE=AC =CE=B8=CE=B1 =CE=B3=CE=AF=CE=BD=CE=B5=CE=B9 =CF=
=8C,=CF=84=CE=B9 =CE=BA=CE=B1=CE=BB=CF=8D=CF=84=CE=B5=CF=81=CE=BF. =CE=
=97 =CF=80=CF=81=CE=BF=CE=B8=CE=B5=CF=83=CE=BC=CE=AF=CE=B1
=CE=B4=CE=AE=CE=BB=CF=89=CF=83=CE=B7=CF=82 =CF=80=CF=81=CE=BF=CF=84=CE=
=B9=CE=BC=CE=AE=CF=83=CE=B5=CF=89=CE=BD =CE=B5=CE=AF=CE=BD=CE=B1=CE=B9 =
=CE=BC=CE=AD=CF=87=CF=81=CE=B9 =CE=BA=CE=B1=CE=B9
=CE=A0=CE=AD=CE=BC=CF=80=CF=84=CE=B7 11/4.

=CE=A6=CE=B9=CE=BB=CE=B9=CE=BA=CE=AC,

=CE=91=CE=93

---------------------------------------------------------------------
=CE=91=CE=BB=CE=BB=CE=B1=CE=B3=CE=AE =CF=84=CF=89=CE=BD =CF=80=CF=81=CE=
=BF=CF=84=CE=B9=CE=BC=CE=AE=CF=83=CE=B5=CF=89=CE=BD =CF=83=CF=8D=CE=BD=
=CE=BF=CF=88=CE=B7=CF=82 =CF=86=CF=8C=CF=81=CE=BF=CF=85=CE=BC:
https://elearning.auth.gr/mod/forum/index.php?id=3D18353

--b1_dlcFuXTv22m9aUXiaj1mCOfVaXy03d9qKOsAq0eXVQ
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: quoted-printable

<div class=3D"navbar">=0A    <a target=3D"_blank" href=3D"https://elearning=
.auth.gr/course/view.php?id=3D18353">NIS-08-06</a>=0A    &raquo;=0A    <a t=
arget=3D"_blank" href=3D"https://elearning.auth.gr/mod/forum/index.php?id=
=3D18353">=CE=A6=CF=8C=CF=81=CE=BF=CF=85=CE=BC</a>=0A    &raquo;=0A    <a t=
arget=3D"_blank" href=3D"https://elearning.auth.gr/mod/forum/view.php?f=3D2=
7447">Forum =CE=91=CE=BD=CE=B1=CE=BA=CE=BF=CE=B9=CE=BD=CF=8E=CF=83=CE=B5=
=CF=89=CE=BD</a>=0A    &raquo;=0A    <a target=3D"_blank" href=3D"https://e=
learning.auth.gr/mod/forum/discuss.php?d=3D209985"> =CE=91=CF=81=CF=87=
=CE=AD=CF=82 =CE=B5=CF=80=CE=B9=CF=83=CF=84=CE=AE=CE=BC=CE=B7=CF=82 =CE=
=B4=CE=B5=CE=B4=CE=BF=CE=BC=CE=AD=CE=BD=CF=89=CE=BD =CE=BA=CE=B1=CE=B9 =
=CE=B9=CF=83=CF=84=CE=BF=CF=8D: =CE=B4=CE=B7=CE=BB=CF=8E=CF=83=CE=B5=CE=
=B9=CF=82 =CF=80=CF=81=CE=BF=CF=84=CE=AF=CE=BC=CE=B7=CF=83=CE=B7=CF=82 =
=CE=B3=CE=B9=CE=B1 =CE=B8=CE=AD=CE=BC=CE=B1=CF=84=CE=B1 =CF=80=CE=B1=CF=
=81=CE=BF=CF=85=CF=83=CE=AF=CE=B1=CF=83=CE=B7=CF=82</a>=0A</div>=0A=0A<tabl=
e border=3D"0" cellpadding=3D"3" cellspacing=3D"0" class=3D"forumpost">=0A =
   <tr class=3D"header">=0A        <td width=3D"35" valign=3D"top" class=3D=
"picture left">=0A            <a href=3D"https://elearning.auth.gr/user/vie=
w.php?id=3D40758&amp;course=3D18353" class=3D"d-inline-block aabtn"><img sr=
c=3D"https://elearning.auth.gr/theme/image.php/_s/adaptable/core/1711978210=
/u/f2" class=3D"userpicture defaultuserpic" width=3D"35" height=3D"35" alt=
=3D"=CE=A6=CF=89=CF=84=CE=BF=CE=B3=CF=81=CE=B1=CF=86=CE=AF=CE=B1 =CE=93=
=CE=BF=CF=8D=CE=BD=CE=B1=CF=81=CE=B7=CF=82 =CE=91=CE=BD=CE=B1=CF=83=CF=
=84=CE=AC=CF=83=CE=B9=CE=BF=CF=82" title=3D"=CE=A6=CF=89=CF=84=CE=BF=CE=
=B3=CF=81=CE=B1=CF=86=CE=AF=CE=B1 =CE=93=CE=BF=CF=8D=CE=BD=CE=B1=CF=81=
=CE=B7=CF=82 =CE=91=CE=BD=CE=B1=CF=83=CF=84=CE=AC=CF=83=CE=B9=CE=BF=CF=
=82" /></a>=0A        </td>=0A        <td class=3D"topic starter">=0A      =
      <div class=3D"subject">=0A                 =CE=91=CF=81=CF=87=CE=
=AD=CF=82 =CE=B5=CF=80=CE=B9=CF=83=CF=84=CE=AE=CE=BC=CE=B7=CF=82 =CE=B4=
=CE=B5=CE=B4=CE=BF=CE=BC=CE=AD=CE=BD=CF=89=CE=BD =CE=BA=CE=B1=CE=B9 =CE=
=B9=CF=83=CF=84=CE=BF=CF=8D: =CE=B4=CE=B7=CE=BB=CF=8E=CF=83=CE=B5=CE=B9=
=CF=82 =CF=80=CF=81=CE=BF=CF=84=CE=AF=CE=BC=CE=B7=CF=83=CE=B7=CF=82 =CE=
=B3=CE=B9=CE=B1 =CE=B8=CE=AD=CE=BC=CE=B1=CF=84=CE=B1 =CF=80=CE=B1=CF=81=
=CE=BF=CF=85=CF=83=CE=AF=CE=B1=CF=83=CE=B7=CF=82=0A            </div>=0A   =
         <div class=3D"author">=0A                =CE=B1=CF=80=CF=8C <a tar=
get=3D'_blank' href=3D'https://elearning.auth.gr/user/view.php?id=3D40758&c=
ourse=3D18353'>=CE=93=CE=BF=CF=8D=CE=BD=CE=B1=CF=81=CE=B7=CF=82 =CE=91=
=CE=BD=CE=B1=CF=83=CF=84=CE=AC=CF=83=CE=B9=CE=BF=CF=82</a> - Friday, 5 Apri=
l 2024, 8:38 PM=0A            </div>=0A        </td>=0A    </tr>=0A    <tr>=
=0A        <td class=3D"left side" valign=3D"top">=0A                &nbsp;=
=0A        </td>=0A        <td class=3D"content">=0A            <p>=CE=
=9A=CE=B1=CE=BB=CE=B7=CF=83=CF=80=CE=AD=CF=81=CE=B1 =CE=BA=CE=B1=CE=B9 =
=CF=80=CE=AC=CE=BB=CE=B9,</p>
<p>=CF=8C=CF=80=CF=89=CF=82 =CF=83=CF=85=CE=B6=CE=B7=CF=84=CE=AE=CE=B8=
=CE=B7=CE=BA=CE=B5 =CF=83=CF=84=CE=B7=CE=BD =CF=83=CE=B7=CE=BC=CE=B5=CF=
=81=CE=B9=CE=BD=CE=AE =CE=B4=CE=B9=CE=AC=CE=BB=CE=B5=CE=BE=CE=B7, =CF=83=
=CF=84=CE=BF elearning =CF=85=CF=80=CE=AC=CF=81=CF=87=CE=B5=CE=B9 =CF=84=
=CF=8C=CF=83=CE=BF =CE=B7 =CE=B2=CE=B1=CF=83=CE=B9=CE=BA=CE=AE =CF=80=CE=
=B5=CF=81=CE=B9=CE=B3=CF=81=CE=B1=CF=86=CE=AE =CF=84=CF=89=CE=BD =CE=B8=
=CE=B5=CE=BC=CE=AC=CF=84=CF=89=CE=BD =CE=B3=CE=B9=CE=B1 =CF=80=CE=B1=CF=
=81=CE=BF=CF=85=CF=83=CE=AF=CE=B1=CF=83=CE=B7 =CF=8C=CF=83=CE=BF =CE=BA=
=CE=B1=CE=B9 =CE=BF =CF=83=CF=8D=CE=BD=CE=B4=CE=B5=CF=83=CE=BC=CE=BF=CF=
=82 =CE=B3=CE=B9=CE=B1 =CF=84=CE=B7 =CF=86=CF=8C=CF=81=CE=BC=CE=B1 =CE=
=B4=CE=AE=CE=BB=CF=89=CF=83=CE=B7=CF=82 =CF=80=CF=81=CE=BF=CF=84=CE=B9=
=CE=BC=CE=AE=CF=83=CE=B5=CF=89=CE=BD. =CE=94=CE=B5=CE=BD =CE=BC=CF=80=CE=
=BF=CF=81=CE=B5=CE=AF =CE=BD=CE=B1 =CF=85=CF=80=CE=AC=CF=81=CF=87=CE=B5=
=CE=B9 =CF=80=CF=81=CE=BF=CF=86=CE=B1=CE=BD=CF=8E=CF=82 =CE=BA=CE=AC=CF=
=80=CE=BF=CE=B9=CE=B1 =CE=B5=CE=B3=CE=B3=CF=8D=CE=B7=CF=83=CE=B7 =CF=8C=
=CF=84=CE=B9 =CE=B8=CE=B1 =CE=BC=CF=80=CE=BF=CF=81=CE=BF=CF=8D=CE=BD =CE=
=BD=CE=B1 =CE=B9=CE=BA=CE=B1=CE=BD=CE=BF=CF=80=CE=BF=CE=B9=CE=B7=CE=B8=
=CE=BF=CF=8D=CE=BD =CF=8C=CE=BB=CE=B5=CF=82 =CE=BF=CE=B9 =CF=80=CF=81=CE=
=BF=CF=84=CE=B9=CE=BC=CE=AE=CF=83=CE=B5=CE=B9=CF=82, =CE=B1=CE=BB=CE=BB=
=CE=AC =CE=B8=CE=B1 =CE=B3=CE=AF=CE=BD=CE=B5=CE=B9 =CF=8C,=CF=84=CE=B9 =
=CE=BA=CE=B1=CE=BB=CF=8D=CF=84=CE=B5=CF=81=CE=BF. =CE=97 =CF=80=CF=81=CE=
=BF=CE=B8=CE=B5=CF=83=CE=BC=CE=AF=CE=B1 =CE=B4=CE=AE=CE=BB=CF=89=CF=83=
=CE=B7=CF=82 =CF=80=CF=81=CE=BF=CF=84=CE=B9=CE=BC=CE=AE=CF=83=CE=B5=CF=
=89=CE=BD =CE=B5=CE=AF=CE=BD=CE=B1=CE=B9 =CE=BC=CE=AD=CF=87=CF=81=CE=B9 =
=CE=BA=CE=B1=CE=B9 =CE=A0=CE=AD=CE=BC=CF=80=CF=84=CE=B7 11/4.</p>
<p>=CE=A6=CE=B9=CE=BB=CE=B9=CE=BA=CE=AC,</p>
<p>=CE=91=CE=93</p>=0A=0A            <div class=3D"commands">=0A           =
 </div>=0A=0A            <div class=3D"link">=0A                <a target=
=3D"_blank" href=3D"https://elearning.auth.gr/mod/forum/discuss.php?d=3D209=
985#p283374">=0A                    =CE=94=CE=B5=CE=AF=CF=84=CE=B5 =CE=
=B1=CF=85=CF=84=CE=AE=CE=BD =CF=84=CE=B7=CE=BD =CE=B1=CE=BD=CE=AC=CF=81=
=CF=84=CE=B7=CF=83=CE=B7 =CF=83=CF=84=CE=B1 =CF=83=CF=85=CE=BC=CF=86=CF=
=81=CE=B1=CE=B6=CF=8C=CE=BC=CE=B5=CE=BD=CE=AC =CF=84=CE=B7=CF=82=0A        =
        </a>=0A            </div>=0A        </td>=0A    </tr>=0A</table>=0A=
=0A<hr />=0A<div class=3D"mdl-align unsubscribelink">=0A    <a href=3D"http=
s://elearning.auth.gr/mod/forum/index.php?id=3D18353">=CE=91=CE=BB=CE=BB=
=CE=B1=CE=B3=CE=AE =CF=84=CF=89=CE=BD =CF=80=CF=81=CE=BF=CF=84=CE=B9=CE=
=BC=CE=AE=CF=83=CE=B5=CF=89=CE=BD =CF=83=CF=8D=CE=BD=CE=BF=CF=88=CE=B7=
=CF=82 =CF=86=CF=8C=CF=81=CE=BF=CF=85=CE=BC</a>=0A</div>

--b1_dlcFuXTv22m9aUXiaj1mCOfVaXy03d9qKOsAq0eXVQ--`

const {
  attachments, // [{ contentType: 'image/gif', fileName: 'smile.gif', content: Uint8Array[71, 73, 70..], ... }]
  body, // { text: 'Hello Alice.\nThis is..', html: '' }
  subject, // 'Test message'
  from, // // { name: 'Bob Example', email: 'bob@internet.com' }
  to, // [{ name: 'Alice Example', email: 'alice@internet.com' }]
  date, // Date('Wed, 20 Aug 2003 16:02:43 -0500')
  ...rest // headers and more
} = parseMail(eml);

console.log(subject, from, to, date, body, attachments, rest);
</script>

<p>Hello world!</p>

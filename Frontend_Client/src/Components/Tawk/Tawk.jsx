import React, { useEffect } from 'react';

const Tawk = () => {
    useEffect(() => {
        var Tawk_API = Tawk_API || "7dbe90dbe1d283a157c1bb61f7507626d4512e97", Tawk_LoadStart = new Date();
        (function() {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/5c59ccd27cf662208c942f18/default';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
        })();
    }, []);

    return;
};

export default Tawk;

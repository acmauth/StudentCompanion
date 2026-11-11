<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
    import { mount, onMount } from "svelte";
    import type { Component } from "svelte";
    import { defineCustomElement } from "@ionic/core/components/ion-nav.js";

    
  
    
  
    
  
    
  
    
  interface Props {
    /**
     * The root component of a Svelte app.
     */
    root: any;
    /**
     * Whether or not the component is animated.
     */
    animated?: boolean|undefined;
    /**
     * An animation function that takes a base element and optional options and returns an Animation object.
     */
    animation: ((baseEl: any, opts?: any) => Animation)|undefined;
    /**
     * Optional parameters for the root component.
     */
    rootParams: undefined|{[key: string]: any};
    /**
     * Whether or not swipe gesture is enabled.
     */
    swipeGesture: boolean|undefined;
  }

  let {
    root,
    animated = true,
    animation,
    rootParams,
    swipeGesture
  }: Props = $props();
  
    let ionNav: HTMLElement = $state();
    let rootComponent: HTMLDivElement = $state();
    let newElement: HTMLDivElement;

    const createHTMLCompFromSvelte = (component: Component<any>, componentProps = {}): HTMLDivElement => {
        // Creating the content wrapper div
        const divWrapper = document.createElement("div");
        const contentID = "id" + Date.now() + Math.floor(Math.random()*10000) + "_wrapperDiv";
        
        divWrapper.id = contentID;
        
        // Creating the contents div
        let navContent = document.createElement("div");
        navContent.id = "id" + Date.now() + Math.floor(Math.random()*10000) + "_contentDiv";
        navContent.style.height = "100%";
        
        // navContent.style.height = "100%"; // 858px is the height of the window, 113px is the height of the Header, 57px is the height of the Footer
        newElement = navContent

        // Adding the content to the parent div
        divWrapper.appendChild(navContent);

        // Adding the wrapper to the body (?)
        // document.body.appendChild(divWrapper);
        
        const props = {
            ...componentProps,
        };
  
        // Letting svelte magically fulfill that new div with content | Might need to pay attention to this
        // mount() builds the DOM synchronously; the page's onMount callbacks run right after.
        // Don't call flushSync() here: inside this onMount it drops the mounted page's onMount callbacks.
        mount(component, {
            target: navContent,
            props,
        });

        return divWrapper; //Returning a div that's parented to Body; And that contains our new element
    };
  
    onMount(() => {
      rootComponent = createHTMLCompFromSvelte(root, {});
    });

  </script>
  
  <!-- 
    Make a native ion Nav component;
    - Bind it to the var ionNav (before on mount) | Unused (!!!)
    - after on mount:
    - pass it the new root component which already has a child, cuz we made it have one
  -->
  <ion-nav
    bind:this={ionNav}
    {animated}
    {animation}
    root-params={rootParams}
    swipe-gesture={swipeGesture}
    root={rootComponent}
    onionNavDidChange={bubble('ionNavDidChange')}
    onionNavWillChange={bubble('ionNavWillChange')}
></ion-nav>
  
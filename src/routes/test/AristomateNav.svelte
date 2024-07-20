<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import type { SvelteComponent } from "svelte";
    import { defineCustomElement } from "@ionic/core/components/ion-nav.js";

    /**
     * The root component of a Svelte app.
     */
    export let root: SvelteComponent;
  
    /**
     * Whether or not the component is animated.
     */
    export let animated: boolean|undefined = true;
  
    /**
     * An animation function that takes a base element and optional options and returns an Animation object.
     */
    export let animation: ((baseEl: any, opts?: any) => Animation)|undefined;
  
    /**
     * Optional parameters for the root component.
     */
    export let rootParams: undefined|{[key: string]: any};
  
    /**
     * Whether or not swipe gesture is enabled.
     */
    export let swipeGesture: boolean|undefined;
  
    let ionNav: HTMLElement;
    let rootComponent: HTMLDivElement;
    let newElement: HTMLDivElement;

    const createHTMLCompFromSvelte = (component: SvelteComponent, componentProps = {}): HTMLDivElement => {
        // Creating the content wrapper div
        const divWrapper = document.createElement("div");
        const contentID = "id" + Date.now() + Math.floor(Math.random()*10000) + "This is the div";
        divWrapper.id = contentID;
        
        // Creating the contents div
        // let navContent = document.createElement("ion-content"); //div -> ion-content
        let navContent = document.createElement("div");
        navContent.id = contentID + "navcontent"
        navContent.style.height = 858 - (113+57) + "px"; // 858px is the height of the window, 113px is the height of the Header, 57px is the height of the Footer
        newElement = navContent

        // Adding the content to the parent div
        divWrapper.appendChild(navContent);

        // Adding the wrapper to the body (?)
        // document.body.appendChild(divWrapper);
        
        const props = {
            ...componentProps,
        };
  
        // Letting svelte magically fulfill that new div with content | Might need to pay attention to this
        new component({
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
    on:ionNavDidChange
    on:ionNavWillChange
  />
  
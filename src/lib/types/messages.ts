export type messages = {
    total: number
    skip: number
    value: Array<{
      subject: string
      body: {}
      cc: string
      bcc: string
      category: string
      dateReceived: string
      identifier: string
      about: string
      id: number
      additionalType: string
      alternateName: string
      description: string
      image: string
      name: string
      url: string
      dateCreated: string
      dateModified: string
      student: number
      sender: number
      recipient: number
      owner: number
      action: number
      attachments: Array<{
        id: number
        additionalType: string
        alternateName: string
        contentType: string
        datePublished: string
        published: boolean
        keywords: string
        thumbnail: string
        version: string
        description: string
        image: string
        name: string
        url: string
        dateCreated: string
        dateModified: string
        attachmentType: number
        owner: number
        actions: Array<{
          additionalType: string
          alternateName: string
          result: number
          startTime: string
          endTime: string
          object: number
          error: number
          code: string
          identifier: string
          id: number
          description: string
          image: string
          name: string
          url: string
          dateCreated: string
          dateModified: string
          initiator: number
          actionStatus: {
            additionalType: string
            alternateName: string
            name: string
            identifier: number
            id: number
            description: string
            image: string
            url: string
            dateCreated: string
            dateModified: string
            createdBy: number
            modifiedBy: number
          }
          target: number
          owner: number
          agent: number
          participants: Array<{
            accountType: number
            id: number
            additionalType: string
            alternateName: string
            description: string
            image: string
            name: string
            url: string
            dateCreated: string
            dateModified: string
            createdBy: number
            modifiedBy: number
          }>
          attachments: Array<string>
          assignees: Array<{
            accountType: number
            id: number
            additionalType: string
            alternateName: string
            description: string
            image: string
            name: string
            url: string
            dateCreated: string
            dateModified: string
            createdBy: number
            modifiedBy: number
          }>
          followers: Array<{
            accountType: number
            id: number
            additionalType: string
            alternateName: string
            description: string
            image: string
            name: string
            url: string
            dateCreated: string
            dateModified: string
            createdBy: number
            modifiedBy: number
          }>
          createdBy: number
          modifiedBy: number
        }>
        createdBy: number
        modifiedBy: number
      }>
      createdBy: number
      modifiedBy: number
    }>
  };


interface elearningMessage {
    id: number
    useridfrom: number
    useridto: number
    subject: string
    text: string
    fullmessage: string
    fullmessageformat: number
    fullmessagehtml: string
    smallmessage: string
    notification: number
    contexturl: string
    contexturlname: string
    timecreated: number
    timeread: number
    usertofullname: string
    userfromfullname: string
    component: string
    eventtype: string
    customdata: string
}
export type elearningMessages = {
    messages: elearningMessage[]
}
#!/bin/env ruby
# -*- encoding : utf-8 -*-

User.create({email:'anser@clustox.com', first_name: 'anser' , last_name:'naseer'})
subjects = Subject.create([{title: 'Geography'},{title: 'History'},{title: 'Physics'},
                                {title: 'Science'},{title: 'English'},{title: 'Chemistry'},
                                {title: 'Math'},{title: 'Business'},{title: 'Biology'},
                                {title: 'Pop Culture'},{title: 'Personal Finance'},
                                {title: 'Technology'},{title: 'Psychology'},{title: 'Sports'},
                                {title: 'Computer Science'}
                              ])

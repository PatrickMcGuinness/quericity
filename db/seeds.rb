#!/bin/env ruby
# -*- encoding : utf-8 -*-
Subject.destroy_all
unless User.exists?(:email => "anser@clustox.com")
  User.create({email:'anser@clustox.com', first_name: 'anser' , last_name:'naseer'})
end
subjects = Subject.create([{title: 'Geography'},{title: 'History'},{title: 'Physics'},
                                {title: 'Science'},{title: 'English'},{title: 'Chemistry'},
                                {title: 'Math'},{title: 'Business'},{title: 'Biology'},
                                {title: 'Pop Culture'},{title: 'Personal Finance'},
                                {title: 'Technology'},{title: 'Psychology'},{title: 'Sports'},
                                {title: 'Computer Science'}
                              ])
topics = Topic.create([{title: 'thermodynamics'},{title: 'geometry'},{title:'trignometry'},
                      {title:'graphics'},{title: 'programming'},{title: 'newton 1st law'}])

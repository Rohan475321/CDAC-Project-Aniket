package com.webblog.service;

import com.webblog.dto.PostDto;
import com.webblog.entity.Post;
import com.webblog.entity.User;
import com.webblog.mapper.PostMapper;
import com.webblog.repository.PostRepository;
import com.webblog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private UserRepository userRepository;

    public List<PostDto> getAllPosts() {
        return postRepository.findAllOrderByCreatedAtDesc().stream()
                .map(postMapper::toDto)
                .collect(Collectors.toList());
    }

    public PostDto getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return postMapper.toDto(post);
    }

    public PostDto createPost(PostDto postDto) {
        User currentUser = getCurrentUser();
        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        post.setAuthor(currentUser);
        Post savedPost = postRepository.save(post);
        return postMapper.toDto(savedPost);
    }

    public PostDto updatePost(Long id, PostDto postDto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User currentUser = getCurrentUser();
        boolean isAdmin = currentUser.getRole().name().equals("ROLE_ADMIN");
        boolean isOwner = post.getAuthor().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You don't have permission to edit this post");
        }

        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        Post updatedPost = postRepository.save(post);
        return postMapper.toDto(updatedPost);
    }

    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User currentUser = getCurrentUser();
        boolean isAdmin = currentUser.getRole().name().equals("ROLE_ADMIN");
        boolean isOwner = post.getAuthor().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You don't have permission to delete this post");
        }

        postRepository.deleteById(id);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

